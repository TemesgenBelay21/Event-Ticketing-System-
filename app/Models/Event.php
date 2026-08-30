<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'event_date',
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Convenience accessor so views/pages can show "12 registered"
     * without loading every ticket row.
     */
    public function getRegistrationsCountAttribute(): int
    {
        return $this->tickets()->count();
    }
}
