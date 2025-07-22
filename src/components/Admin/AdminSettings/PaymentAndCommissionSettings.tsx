import { Banknote } from 'lucide-react';
import "./AdminSettings.scss"

const PaymentAndCommissionSettings = () => {
    return (
        <div className="admin-settings">

            <div className="admin-settings__header">
                <Banknote size={24} />
                <h3 className="admin-settings__title">
                    Commission and Payout Settings
                </h3>
            </div>

            <div className="admin-settings__input-row" >
                <div>
                    <label>
                        Platform Commission Rate (%)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value="8" />
                </div>

                <div>
                    <label>
                        Processing Fee (%)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value="0" />
                </div>

            </div>

            <div className="admin-settings__input-row" >
                <div>
                    <label>
                        Minimum Payout Threshold (LKR)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value="5000" />
                </div>

                <div>
                    <label>
                        Default Payment Cycle 
                        <span className="input-required">*</span>
                    </label>
                     <select >
                        <option value="daily">Daily</option>
                        <option value="weekly" selected>Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="onRequest">On Request</option>
                    </select>
                </div>

            </div>

        </div>

    )
}

export default PaymentAndCommissionSettings
