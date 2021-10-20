from django.db.models.fields import FloatField
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from apps.users.mixins import CustomLoginRequiredMixin
from apps.transactions.serializers import ListTransactionSerializer, TransactionSerializer
from apps.transactions.models import Transaction
from apps.transactions.models import Category
from rest_framework import generics, status
from datetime import datetime
from calendar import monthrange
from django.db.models import Sum
from django.db.models.functions import Cast
from collections import defaultdict
import operator

class TransactionAdd(CustomLoginRequiredMixin, generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def post(self, request, *args, **kwargs):

        serializer = TransactionSerializer()
        serializer.validate(request.data)
        category_id = int(request.data['category'])

        category = Category.objects.get(id=category_id)
        if (category is None):
            response = Response({'error': "Category not found."}, status=status.HTTP_404_NOT_FOUND)
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = "application/json"
            response.renderer_context = {}
            return response

        request.data._mutable = True
        request.data['user'] = request.login_user.id
        request.data['category'] = category.id

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
        
        category_id = int(request.data['category'])

        category = Category.objects.get(id=category_id)
        if (category is None):
            response = Response({'error': "Category not found."}, status=status.HTTP_404_NOT_FOUND)
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = "application/json"
            response.renderer_context = {}
            return response

        request.data._mutable = True
        request.data['user'] = request.login_user.id
        request.data['category'] = category.id

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
    serializer_class = ListTransactionSerializer

    def get(self, request, *args, **kwargs):
        self.queryset = Transaction.objects.order_by('-date').filter(user_id = request.login_user.id)
        return self.list(request, *args, **kwargs)

class TransactionReport(CustomLoginRequiredMixin, generics.ListAPIView):
    serializer_class = ListTransactionSerializer

    def get(self, request, *args, **kwargs):
        today = datetime.today()
        past_months = today.month - 3
        year = today.year
        start_date = datetime(year, past_months, 1).date()
        end_date = datetime(year, today.month, monthrange(year, today.month)[-1]).date()
        
        select_data = {"date": """strftime('%%m/%%Y', date)"""}

        transactions = Transaction.objects.filter(
            user_id = request.login_user.id, 
            date__gte=start_date,
            date__lte=end_date
        ).extra(select_data).values("date", 'type').annotate(total_amount=Sum('amount')).order_by('date')

        list_result = [entry for entry in transactions] 
        groups = defaultdict(list)
        
        for obj in list_result:
            groups[obj['date']].append(obj)

        new_list = groups.values()
        
        return Response(new_list)

class ExpenseReport(CustomLoginRequiredMixin, generics.ListAPIView):
    serializer_class = ListTransactionSerializer

    def get(self, request, *args, **kwargs):
        today = datetime.today()
        past_months = today.month - 3
        year = today.year
        start_date = datetime(year, past_months, 1).date()
        end_date = datetime(year, today.month, monthrange(year, today.month)[-1]).date()
        
        select_data = {"date": """strftime('%%m/%%Y', date)"""}

        expenses = Transaction.objects.filter(
            user_id=request.login_user.id, 
            type='expense', 
            date__gte=start_date,
            date__lte=end_date
        ).extra(select_data).values('date').annotate(total_amount=Sum('amount'))
            
        total_expense = sum(map(operator.itemgetter('total_amount'),expenses))

        transactions = Transaction.objects.filter(
            user_id=request.login_user.id, 
            type='expense', 
            date__gte=start_date,
            date__lte=end_date
        ).extra(select_data).values('category_id').annotate(
            total_amount=Sum('amount'), 
            total_amount_percent=Cast(Sum('amount'), FloatField()) * 100 / total_expense).order_by('date')
        
        for dic in transactions:
            category = Category.objects.filter(id=dic['category_id']).get()
            dic['category_name'] = category.name
            dic['category_color'] = category.color_code
            
        return Response({
            'data': transactions, 
            'total_expense': total_expense, 
            'budget': request.login_user.budget,
            'reminder': request.login_user.budget - total_expense,
            })

