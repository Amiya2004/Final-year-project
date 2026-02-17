// Razorpay Payment Service
// Supports both real Razorpay keys and simulated test payments

const RAZORPAY_KEY_ID = 'rzp_test_ABC123DEF456';

// Set to true to use simulated payment (no real Razorpay key needed)
// Set to false when you have a valid Razorpay key
const USE_SIMULATED_PAYMENT = true;

// UPI ID for QR code payment (change to your real UPI ID)
const MERCHANT_UPI_ID = 'nellaistore@upi';
const MERCHANT_NAME = 'Nellai Velmurugan Store';

/**
 * Initialize Razorpay payment
 */
export const initiateRazorpayPayment = ({
    amount,
    currency = 'INR',
    name = 'Nellai Velmurugan Store',
    description = 'Grocery Purchase',
    orderId,
    prefill = {},
    onSuccess,
    onFailure,
    onDismiss,
}) => {
    // Use simulated payment for demo/test mode
    if (USE_SIMULATED_PAYMENT) {
        return simulatePayment({ amount, currency, orderId, prefill, onSuccess, onFailure, onDismiss });
    }

    return new Promise((resolve, reject) => {
        if (!window.Razorpay) {
            const error = 'Razorpay SDK not loaded. Please check your internet connection.';
            if (onFailure) onFailure({ error });
            reject(new Error(error));
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: Math.round(amount * 100),
            currency,
            name,
            description,
            image: '',
            handler: function (response) {
                const paymentData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id || null,
                    razorpay_signature: response.razorpay_signature || null,
                    orderId,
                    amount,
                    currency,
                    status: 'success',
                    timestamp: new Date().toISOString(),
                };
                if (onSuccess) onSuccess(paymentData);
                resolve(paymentData);
            },
            prefill: {
                name: prefill.name || '',
                email: prefill.email || '',
                contact: prefill.contact || '',
            },
            notes: {
                order_id: orderId,
                store: 'Nellai Velmurugan Store',
            },
            theme: { color: '#22c55e' },
            modal: {
                ondismiss: function () {
                    if (onDismiss) onDismiss();
                    reject(new Error('Payment cancelled by user'));
                },
                escape: true,
                animation: true,
            },
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                const failureData = {
                    code: response.error.code,
                    description: response.error.description,
                    source: response.error.source,
                    step: response.error.step,
                    reason: response.error.reason,
                    orderId,
                    status: 'failed',
                    timestamp: new Date().toISOString(),
                };
                if (onFailure) onFailure(failureData);
                reject(failureData);
            });
            rzp.open();
        } catch (error) {
            if (onFailure) onFailure({ error: error.message });
            reject(error);
        }
    });
};

/**
 * Simulated payment with QR code support
 */
const simulatePayment = ({ amount, currency, orderId, prefill, onSuccess, onFailure, onDismiss }) => {
    return new Promise((resolve, reject) => {
        const overlay = document.createElement('div');
        overlay.id = 'sim-payment-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            animation: simFadeIn 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white; border-radius: 20px; width: 440px; max-width: 94vw;
            box-shadow: 0 25px 60px rgba(0,0,0,0.35); overflow: hidden;
            animation: simSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-height: 95vh; overflow-y: auto;
        `;

        const amountFormatted = new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR'
        }).format(amount);

        // Use the custom QR code image
        const qrCodeUrl = '/qr-code.jpeg';

        modal.innerHTML = `
            <style>
                @keyframes simFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes simSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes simSpin { to { transform: rotate(360deg); } }
                @keyframes simCheck { 0% { stroke-dashoffset: 50; } 100% { stroke-dashoffset: 0; } }
                @keyframes simQrPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 0 12px rgba(34,197,94,0); } }
                @keyframes simDotBlink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
                .sim-btn { 
                    width: 100%; padding: 14px; border: none; border-radius: 12px; 
                    font-size: 15px; font-weight: 700; cursor: pointer; 
                    transition: all 0.2s ease; display: flex; align-items: center;
                    justify-content: center; gap: 8px; letter-spacing: 0.3px;
                }
                .sim-btn:hover { transform: translateY(-1px); }
                .sim-tab-bar {
                    display: flex; background: #f1f5f9; border-radius: 10px;
                    padding: 4px; margin-bottom: 18px; gap: 4px;
                }
                .sim-tab {
                    flex: 1; padding: 10px 8px; border: none; border-radius: 8px;
                    background: transparent; font-size: 13px; font-weight: 600;
                    color: #64748b; cursor: pointer; transition: all 0.2s ease;
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                }
                .sim-tab.active {
                    background: white; color: #1e293b;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                .sim-tab-content { display: none; }
                .sim-tab-content.active { display: block; }
                .sim-input {
                    width: 100%; padding: 12px 14px; border: 2px solid #e2e8f0;
                    border-radius: 10px; font-size: 14px; outline: none;
                    transition: border-color 0.2s; box-sizing: border-box;
                }
                .sim-input:focus { border-color: #22c55e; }
                .sim-input-group { margin-bottom: 12px; }
                .sim-input-label { 
                    font-size: 12px; font-weight: 600; color: #64748b; 
                    margin-bottom: 6px; display: block;
                }
            </style>
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 20px 24px; color: white; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(34,197,94,0.1); border-radius: 50%;"></div>
                <div style="display: flex; align-items: center; justify-content: space-between; position: relative;">
                    <div>
                        <div style="font-size: 12px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px;">Payment To</div>
                        <div style="font-size: 16px; font-weight: 700; margin-top: 2px;">${MERCHANT_NAME}</div>
                        <div style="font-size: 28px; font-weight: 800; margin-top: 6px; color: #4ade80;">${amountFormatted}</div>
                    </div>
                    <button id="sim-close" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">✕</button>
                </div>
                <div style="font-size: 11px; opacity: 0.5; margin-top: 6px; font-family: monospace;">${orderId}</div>
            </div>

            <!-- Payment Body -->
            <div id="sim-body" style="padding: 20px 24px 24px;">
                <!-- Tab Bar -->
                <div class="sim-tab-bar">
                    <button class="sim-tab active" data-tab="qr">📱 Scan QR</button>
                    <button class="sim-tab" data-tab="upi">💰 UPI ID</button>
                    <button class="sim-tab" data-tab="card">💳 Card</button>
                    <button class="sim-tab" data-tab="bank">🏦 Bank</button>
                </div>

                <!-- QR Code Tab -->
                <div class="sim-tab-content active" id="tab-qr">
                    <div style="text-align: center; padding: 8px 0;">
                        <div style="font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 14px;">
                            Scan with any UPI app to pay
                        </div>
                        <div style="display: inline-block; padding: 16px; background: white; border-radius: 16px; border: 2px solid #e2e8f0; animation: simQrPulse 2s ease-in-out infinite;">
                            <img src="${qrCodeUrl}" alt="UPI QR Code" style="width: 180px; height: 180px; display: block; border-radius: 8px;" />
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; color: #64748b; font-size: 13px;">
                            <span style="display: flex; gap: 4px;">
                                <span style="animation: simDotBlink 1.4s ease-in-out infinite;">●</span>
                                <span style="animation: simDotBlink 1.4s ease-in-out 0.2s infinite;">●</span>
                                <span style="animation: simDotBlink 1.4s ease-in-out 0.4s infinite;">●</span>
                            </span>
                            Waiting for payment
                        </div>
                        <div style="display: flex; justify-content: center; gap: 16px; margin-top: 16px;">
                            <div style="text-align: center;">
                                <div style="width: 44px; height: 44px; background: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px; font-size: 20px;">G</div>
                                <span style="font-size: 10px; color: #94a3b8;">GPay</span>
                            </div>
                            <div style="text-align: center;">
                                <div style="width: 44px; height: 44px; background: #f5f3ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px; font-size: 20px;">P</div>
                                <span style="font-size: 10px; color: #94a3b8;">PhonePe</span>
                            </div>
                            <div style="text-align: center;">
                                <div style="width: 44px; height: 44px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px; font-size: 20px;">₿</div>
                                <span style="font-size: 10px; color: #94a3b8;">BHIM</span>
                            </div>
                            <div style="text-align: center;">
                                <div style="width: 44px; height: 44px; background: #ecfdf5; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px; font-size: 20px;">P</div>
                                <span style="font-size: 10px; color: #94a3b8;">Paytm</span>
                            </div>
                        </div>
                        <button id="sim-qr-paid" class="sim-btn" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; margin-top: 20px;">
                            ✅ I've completed the payment
                        </button>
                    </div>
                </div>

                <!-- UPI ID Tab -->
                <div class="sim-tab-content" id="tab-upi">
                    <div class="sim-input-group">
                        <label class="sim-input-label">Enter UPI ID</label>
                        <input class="sim-input" type="text" placeholder="yourname@upi" value="${prefill.contact ? prefill.contact + '@upi' : ''}" />
                    </div>
                    <button class="sim-btn sim-pay-method" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white;">
                        🔒 Pay ${amountFormatted}
                    </button>
                </div>

                <!-- Card Tab -->
                <div class="sim-tab-content" id="tab-card">
                    <div class="sim-input-group">
                        <label class="sim-input-label">Card Number</label>
                        <input class="sim-input" type="text" placeholder="4111 1111 1111 1111" maxlength="19" />
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="sim-input-group">
                            <label class="sim-input-label">Expiry</label>
                            <input class="sim-input" type="text" placeholder="MM/YY" maxlength="5" />
                        </div>
                        <div class="sim-input-group">
                            <label class="sim-input-label">CVV</label>
                            <input class="sim-input" type="password" placeholder="•••" maxlength="3" />
                        </div>
                    </div>
                    <div class="sim-input-group">
                        <label class="sim-input-label">Name on Card</label>
                        <input class="sim-input" type="text" placeholder="John Doe" value="${prefill.name || ''}" />
                    </div>
                    <button class="sim-btn sim-pay-method" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; margin-top: 4px;">
                        🔒 Pay ${amountFormatted}
                    </button>
                </div>

                <!-- Net Banking Tab -->
                <div class="sim-tab-content" id="tab-bank">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                        ${['SBI', 'HDFC', 'ICICI', 'Axis', 'BOB', 'PNB'].map(bank => `
                            <div class="sim-bank-option" style="padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; text-align: center; font-size: 13px; font-weight: 600; color: #1e293b; transition: all 0.2s;"
                                onmouseover="this.style.borderColor='#22c55e'; this.style.background='#f0fdf4';"
                                onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white';">
                                🏦 ${bank}
                            </div>
                        `).join('')}
                    </div>
                    <button class="sim-btn sim-pay-method" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white;">
                        🔒 Pay via Net Banking
                    </button>
                </div>

                <div style="text-align: center; margin-top: 16px; font-size: 11px; color: #94a3b8; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    🔒 Secured by <span style="font-weight: 700; color: #3b82f6;">Razorpay</span>
                    <span style="margin: 0 4px; color: #e2e8f0;">|</span>
                    <span style="color: #f59e0b;">⚡ Test Mode</span>
                </div>
            </div>

            <!-- Processing State (hidden) -->
            <div id="sim-processing" style="display: none; padding: 50px 24px; text-align: center;">
                <div style="width: 56px; height: 56px; border: 4px solid #e2e8f0; border-top-color: #22c55e; border-radius: 50%; margin: 0 auto 24px; animation: simSpin 0.8s linear infinite;"></div>
                <div style="font-size: 17px; font-weight: 700; color: #1e293b;">Processing Payment</div>
                <div style="font-size: 13px; color: #64748b; margin-top: 8px;">Please wait, verifying your transaction...</div>
                <div style="font-size: 24px; font-weight: 800; color: #22c55e; margin-top: 12px;">${amountFormatted}</div>
            </div>

            <!-- Success State (hidden) -->
            <div id="sim-success" style="display: none; padding: 50px 24px; text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 8px 30px rgba(34,197,94,0.3);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" style="stroke-dasharray: 50; animation: simCheck 0.5s ease forwards;"></polyline>
                    </svg>
                </div>
                <div style="font-size: 20px; font-weight: 800; color: #1e293b;">Payment Successful!</div>
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-top: 8px;">${amountFormatted}</div>
                <div id="sim-payment-id" style="font-size: 12px; color: #94a3b8; margin-top: 10px; font-family: monospace;"></div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Tab switching
        const tabs = modal.querySelectorAll('.sim-tab');
        const tabContents = modal.querySelectorAll('.sim-tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                const target = modal.querySelector(`#tab-${tab.dataset.tab}`);
                if (target) target.classList.add('active');
            });
        });

        // Close function
        const closeModal = () => {
            document.body.style.overflow = '';
            overlay.remove();
            if (onDismiss) onDismiss();
            reject(new Error('Payment cancelled by user'));
        };

        modal.querySelector('#sim-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Process payment function (shared by all methods)
        const processPayment = () => {
            const body = modal.querySelector('#sim-body');
            const processing = modal.querySelector('#sim-processing');
            const success = modal.querySelector('#sim-success');

            body.style.display = 'none';
            processing.style.display = 'block';

            setTimeout(() => {
                processing.style.display = 'none';
                success.style.display = 'block';

                const paymentId = 'pay_' + generateRandomId();
                modal.querySelector('#sim-payment-id').textContent = 'Payment ID: ' + paymentId;

                const paymentData = {
                    razorpay_payment_id: paymentId,
                    razorpay_order_id: 'order_' + generateRandomId(),
                    razorpay_signature: 'sig_' + generateRandomId(),
                    orderId,
                    amount,
                    currency,
                    status: 'success',
                    timestamp: new Date().toISOString(),
                };

                setTimeout(() => {
                    document.body.style.overflow = '';
                    overlay.remove();
                    if (onSuccess) onSuccess(paymentData);
                    resolve(paymentData);
                }, 1500);
            }, 2000);
        };

        // Bind pay buttons
        modal.querySelectorAll('.sim-pay-method').forEach(btn => {
            btn.addEventListener('click', processPayment);
        });

        // QR "I've paid" button
        const qrPaidBtn = modal.querySelector('#sim-qr-paid');
        if (qrPaidBtn) {
            qrPaidBtn.addEventListener('click', processPayment);
        }
    });
};

/**
 * Generate a random alphanumeric ID
 */
const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 14; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generate a unique order ID
 */
export const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ORD_${timestamp}_${random}`.toUpperCase();
};
