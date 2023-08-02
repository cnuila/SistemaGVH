from .serializers import LogSerializer
from django.utils import timezone

# add a log
def addLog(request, description, user, *args, **kwargs):
    data = {
        'description': description,
        'user': user.email,
        'date': timezone.now().date(),
        
    }
    serializer = LogSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)