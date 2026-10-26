<?php

namespace App\Http\Controllers\Settings;

use App\Actions\PaymentProcessors\TestMercadoPagoConnection;
use App\Actions\Settings\SavePaymentProcessor;
use App\Actions\Settings\TogglePaymentProcessor as ToggleProcessor;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StorePaymentProcessorRequest;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PaymentProcessorController extends Controller
{
    public function show(): Response
    {
        $processors = app(AuthenticatedUser::class)->get()->paymentProcessors()->get()->keyBy('processor.value');

        return Inertia::render('settings/payment-processors', [
            'processors' => [
                'stripe' => $processors->get('stripe') ? ['is_active' => $processors->get('stripe')->is_active] : null,
                'efi_bank' => $processors->get('efi_bank') ? ['is_active' => $processors->get('efi_bank')->is_active] : null,
                'mercado_pago' => $processors->get('mercado_pago') ? ['is_active' => $processors->get('mercado_pago')->is_active] : null,
            ],
        ]);
    }

    /**
     * @throws \Exception
     * @throws Throwable
     */
    public function store(StorePaymentProcessorRequest $request, SavePaymentProcessor $savePaymentProcessor, TestMercadoPagoConnection $testMercadoPagoConnection): RedirectResponse
    {
        $result = $savePaymentProcessor->handle($request, app(AuthenticatedUser::class)->get(), $testMercadoPagoConnection);

        $result['success'] ? Toast::success($result['message']) : Toast::error($result['message']);

        return back();
    }

    /**
     * @throws Throwable
     */
    public function toggleStatus(string $processor, ToggleProcessor $toggleProcessor): RedirectResponse
    {
        $paymentProcessor = $toggleProcessor->handle(app(AuthenticatedUser::class)->get(), $processor);

        Toast::success(
            $paymentProcessor->is_active ? __('toasts.payment_processor_enabled') : __('toasts.payment_processor_disabled')
        );

        return back();
    }
}
