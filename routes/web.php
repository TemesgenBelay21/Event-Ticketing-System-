<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DiscountCodeController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\OrganizerController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\TicketTypeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ScannerController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});

// --- Guest-only routes (registration / login) -----------------------------
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// --- Authenticated routes (all roles) -------------------------------------
Route::middleware('auth')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Regular users: browse events, book tickets, view/download their own tickets.
    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('tickets/{ticket}/pdf', [TicketController::class, 'downloadPdf'])->name('tickets.pdf');

    // Payments (Chapa)
    Route::match(['get', 'post'], 'tickets/{ticket}/pay', [PaymentController::class, 'initialize'])->name('payment.initialize');
    Route::get('payment/callback/{reference}', [PaymentController::class, 'callback'])->name('payment.callback');
    Route::get('payment/success', [PaymentController::class, 'success'])->name('payment.success');

    // Discount code validation
    Route::post('discounts/validate', [PaymentController::class, 'validateDiscount'])->name('discounts.validate');
});

// --- Chapa webhook (no CSRF, POST) -----------------------------------------
Route::post('payment/webhook', [PaymentController::class, 'webhook'])
    ->name('payment.webhook');

// --- Admin/Organizer routes --------------------------------------------------
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::post('events', [EventController::class, 'store'])->name('events.store');
    Route::put('events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    Route::get('events/{event}/ticket-types', [TicketTypeController::class, 'index'])->name('ticket-types.index');
    Route::post('events/{event}/ticket-types', [TicketTypeController::class, 'store'])->name('ticket-types.store');
    Route::put('events/{event}/ticket-types/{ticketType}', [TicketTypeController::class, 'update'])->name('ticket-types.update');
    Route::delete('events/{event}/ticket-types/{ticketType}', [TicketTypeController::class, 'destroy'])->name('ticket-types.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::patch('users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('organizers', [OrganizerController::class, 'index'])->name('organizers.index');
    Route::put('organizers/{organizerProfile}', [OrganizerController::class, 'update'])->name('organizers.update');
    Route::delete('organizers/{organizerProfile}', [OrganizerController::class, 'destroy'])->name('organizers.destroy');

    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('discount-codes', [DiscountCodeController::class, 'index'])->name('discount-codes.index');
    Route::post('discount-codes', [DiscountCodeController::class, 'store'])->name('discount-codes.store');
    Route::put('discount-codes/{discountCode}', [DiscountCodeController::class, 'update'])->name('discount-codes.update');
    Route::delete('discount-codes/{discountCode}', [DiscountCodeController::class, 'destroy'])->name('discount-codes.destroy');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');

    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    Route::get('scanner', [ScannerController::class, 'index'])->name('scanner.index');
    Route::post('scanner/verify', [ScannerController::class, 'verify'])->name('scanner.verify');
});
