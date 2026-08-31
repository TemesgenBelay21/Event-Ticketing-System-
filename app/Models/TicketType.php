<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'quantity',
        'description',
    ];

    protected $casts = [
        'price' => 'float',
        'quantity' => 'integer',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function getTicketsSoldAttribute(): int
    {
        return $this->tickets()->count();
    }

    public function getAvailableAttribute(): int
    {
        return max(0, $this->quantity - $this->tickets()->count());
    }

    public function getIsSoldOutAttribute(): bool
    {
        return $this->quantity > 0 && $this->available <= 0;
    }
}
