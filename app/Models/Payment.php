<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'discount_code_id',
        'amount',
        'discount_amount',
        'currency',
        'tx_ref',
        'chapa_ref',
        'status',
        'payment_method',
        'metadata',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'discount_amount' => 'float',
        'metadata' => 'array',
        'paid_at' => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function discountCode(): BelongsTo
    {
        return $this->belongsTo(DiscountCode::class);
    }
}
