from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Disease)
admin.site.register(PatientDisease)
admin.site.register(Appointment)
admin.site.register(MedicalRecord)
admin.site.register(TreatmentPlan)