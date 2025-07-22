import React from 'react';
import { CreditCard } from 'lucide-react'
import "./AdminSettings.scss"

const SubscriptionPlanSettings = () => {
    return (
        <div className="admin-settings">
            <div className="admin-settings__header">
                <CreditCard size={24} />
                <h3 className="admin-settings__title">
                    Subscription Plan Settings
                </h3>
            </div>

            <div className="admin-settings__input-row">
                <div>
                    <label>
                        1 Month Plan Price (LKR)
                        <span className="input-required">*</span>
                    </label>
                    <input type="number" value="499" min="0" step="1" />
                </div>

                <div>
                    <label>
                        3 Months Plan Price (LKR)
                        <span className="input-required">*</span>
                    </label>
                    <input type="number" value="1299" min="0" step="1" />
                </div>
            </div>

            <div className="admin-settings__input-row">
                <div>
                    <label>
                        6 Months Plan Price (LKR)
                        <span className="input-required">*</span>
                    </label>
                    <input type="number" value="2499" min="0" step="1" />
                </div>

                <div>
                    <label>
                        12 Months Plan Price (LKR)
                        <span className="input-required">*</span>
                    </label>
                    <input type="number" value="4999" min="0" step="1" />
                </div>
            </div>

        </div>
    )
}

export default SubscriptionPlanSettings 