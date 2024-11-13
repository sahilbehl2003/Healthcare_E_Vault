
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from chat.serializers import UserSerializer, UserSerializerWithToken, PatientSerializer, DoctorSerializer, AppointmentSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from chat.models import Doctor, Patient, Appointment



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k,v in serializer.items():
            data[k] = v

        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    else:
        return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_patient(request):
    data = request.data
    try:
        user = User.objects.get(username=data['username'])
        patient_data = {
            'user': user.id,
            'date_of_birth': data['date_of_birth'],
            'gender': data['gender'],
            'contact_number': data['contact_number'],
            'address': data['address'],
            'medical_history': data['medical_history']
        }
        serializer = PatientSerializer(data=patient_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def doctor_list(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    user = request.user
    patient = None

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return Response({"error": "Patient does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    doctor_id = request.data.get('doctor')
    appointment_date = request.data.get('appointment_date')
    reason = request.data.get('reason')
    status_value = request.data.get('status')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    appointment = Appointment.objects.create(
        patient=patient,
        doctor=doctor,
        appointment_date=appointment_date,
        reason=reason,
        status=status_value,
    )

    return Response({"success": "Appointment created successfully"}, status=status.HTTP_201_CREATED)