from django.contrib import admin
from . import models
from django.db.models import Count, Sum, Min, Max
from django.db.models.functions import Trunc
from django.db.models import DateTimeField

from math import floor

# Register your models here.
@admin.register(models.EventoInversionista)
class SaleSummaryAdmin(admin.ModelAdmin):
    change_list_template = 'admin/eventos_inversionista.html'
    date_hierarchy = 'timestamp'
    list_filter = (
        'accion',
        'usuario'
    )

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(
            request,
            extra_context=extra_context,
        )
        try:
            qs = response.context_data['cl'].queryset
        except (AttributeError, KeyError):
            return response

        period = get_next_in_date_hierarchy(
            request,
            self.date_hierarchy,
        )
        response.context_data['period'] = period

        summary_over_time = qs.annotate(
            period=Trunc(
                'timestamp',
                period,
                output_field=DateTimeField(),
            ),
        ).values('period', 'accion').annotate(total=Count('accion')).order_by('period')
        summary_range = summary_over_time.aggregate(
            low=Min('total'),
            high=Max('total'),
        )

        high = summary_range.get('high', 0)
        low = summary_range.get('low', 0)
        low = floor(low/2)  if low and low > 0 else 0
        response.context_data['summary_over_time'] = [{
            'period': x['period'],
            'accion': x['accion'],
            'total': x['total'] or 0,
            'pct': \
               ((x['total'] or 0) - low) / (high - low) * 100 
               if high > low else 0,
        } for x in summary_over_time]

        # Usuario invertir primer paso
        summary_over_time = qs.filter(accion="CONFIRM_INVESTMENT_to_FILL_INFO").annotate(
            period=Trunc(
                'timestamp',
                period,
                output_field=DateTimeField(),
            ),
        ).values('period', 'inversion__id_solicitud__ticket', 'usuario__email', 'accion').annotate(total=Sum('inversion__monto')).order_by('period')
        summary_range = summary_over_time.aggregate(
            low=Min('total'),
            high=Max('total'),
        )
        high = summary_range.get('high', 0)
        low = summary_range.get('low', 0)
        low = floor(low/2) if low and low > 0 else 0
        response.context_data['summary_confirm_investment'] = [{
            'usuario': x['usuario__email'],
            'accion': x['accion'],
            'period': x['period'],
            'solicitud': x['inversion__id_solicitud__ticket'],
            'total': x['total'] or 0,
            'pct': \
               ((x['total'] or 0) - low) / (high - low) * 100 
               if high > low else 0,
        } for x in summary_over_time]
        
        return response

@admin.register(models.EventoUsuario)
class EventoUsuarioAdmin(admin.ModelAdmin):
    change_list_template = 'admin/eventos_usuario.html'
    date_hierarchy = 'timestamp'
    list_filter = (
        'accion',
        'usuario'
    )

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(
            request,
            extra_context=extra_context,
        )
        try:
            qs = response.context_data['cl'].queryset
        except (AttributeError, KeyError):
            return response

        period = get_next_in_date_hierarchy(
            request,
            self.date_hierarchy,
        )
        response.context_data['period'] = period

        summary_over_time = qs.annotate(
            period=Trunc(
                'timestamp',
                period,
                output_field=DateTimeField(),
            ),
        ).values('period', 'accion').annotate(total=Count('accion')).order_by('period')
        summary_range = summary_over_time.aggregate(
            low=Min('total'),
            high=Max('total'),
        )
        high = summary_range.get('high', 0)
        low = summary_range.get('low', 0)
        low = floor(low/2) if low and low > 0 else 0
        response.context_data['summary_over_time'] = [{
            'period': x['period'],
            'accion': x['accion'],
            'total': x['total'] or 0,
            'pct': \
               ((x['total'] or 0) - low) / (high - low) * 100 
               if high > low else 0,
        } for x in summary_over_time]
        
        return response

def get_next_in_date_hierarchy(request, date_hierarchy):
    if date_hierarchy + '__day' in request.GET:
        return 'hour'
    if date_hierarchy + '__month' in request.GET:
        return 'day'
    if date_hierarchy + '__year' in request.GET:
        return 'week'
    return 'month'