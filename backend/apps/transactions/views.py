from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from apps.users.mixins import CustomLoginRequiredMixin
from apps.transactions.serializers import TransactionSerializer
from apps.transactions.models import Transaction
from rest_framework import generics, status
from datetime import datetime
from calendar import monthrange
from django.db.models import Sum
from collections import defaultdict

class TransactionAdd(CustomLoginRequiredMixin, generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def post(self, request, *args, **kwargs):

        serializer = TransactionSerializer()
        serializer.validate(request.data)

        request.data._mutable = True
        request.data['user_id'] = request.login_user.id

        return self.create(request, *args, **kwargs)

class TransactionUpdate(CustomLoginRequiredMixin, generics.UpdateAPIView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    lookup_field = 'id'

    def put(self, request, *args, **kwargs):

        serializer = TransactionSerializer()
        serializer.validate(request.data)

        # Get URL Param
        id = self.kwargs['id']

        transaction = Transaction.objects.filter(user_id=request.login_user.id, id=id).first()

        if transaction is None:
            response = Response({'error': "Transaction not found."}, status=status.HTTP_400_BAD_REQUEST)
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = "application/json"
            response.renderer_context = {}
            return response

        request.data._mutable = True
        request.data['user_id'] = request.login_user.id

        return self.update(request, *args, **kwargs)

class TransactionDelete(CustomLoginRequiredMixin, generics.DestroyAPIView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        # Get URL Param
        id = self.kwargs['id']

        transaction = Transaction.objects.filter(user_id=request.login_user.id, id=id).first()

        if transaction is None:
            response = Response({'error': "Transaction not found."}, status=status.HTTP_400_BAD_REQUEST)
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = "application/json"
            response.renderer_context = {}
            return response

        self.destroy(request, *args, **kwargs)
        
        return Response({'message': "Success."})
                
class TransactionList(CustomLoginRequiredMixin, generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get(self, request, *args, **kwargs):
        self.queryset = Transaction.objects.order_by('-created_at').filter(user_id = request.login_user.id)
        return self.list(request, *args, **kwargs)

class TransactionReport(CustomLoginRequiredMixin, generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get(self, request, *args, **kwargs):
        today = datetime.today()
        past_months = today.month - 2
        year = today.year
        start_date = datetime(year, past_months, 1).date()
        end_date = datetime(year, today.month, monthrange(year, today.month)[-1]).date()
        
        select_data = {"created_at": """strftime('%%m/%%Y', created_at)"""}

        transactions = Transaction.objects.filter(
            user_id = request.login_user.id, 
            created_at__gte=start_date,
            created_at__lte=end_date
        ).extra(select_data).values("created_at", 'type').annotate(total_amount=Sum('amount')).order_by('created_at')

        list_result = [entry for entry in transactions] 
        groups = defaultdict(list)
        
        for obj in list_result:
            groups[obj['created_at']].append(obj)

        new_list = groups.values()
        
        return Response(new_list)