import React, { useState } from 'react';
import { DivideCircle, XCircle, Shield, CheckCircle } from 'lucide-react';
import "./AdminSettings.scss"

interface RefundPolicySettings {
    fullRefundDays: number;
    partialRefundDays: number;
    partialRefundPercentage: number;
    platformCommission: number;
    noRefundDays: number;
    noRefundServiceCenterPercentage: number;
}

const RefundPolicySettings: React.FC = () => {
    const [settings, setSettings] = useState<RefundPolicySettings>({
        fullRefundDays: 7,
        partialRefundDays: 3,
        partialRefundPercentage: 50,
        platformCommission: 8,
        noRefundDays: 3,
        noRefundServiceCenterPercentage: 92
    });

    return (
        <div className="admin-settings">
            <div className="admin-settings__header">
                <Shield />
                <h3 className="admin-settings__title">
                    Refund Policy Settings
                </h3>
            </div>

            <div className="admin-settings">

                <div className="admin-settings__header">
                    <CheckCircle />
                    <h4 className="admin-settings__sub-title">
                        100% Refund Policy
                    </h4>
                </div>

                <div className="admin-settings__input-row" >

                    <div>
                        <label>
                            Days Before Check-In for Full Refund
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="7" />
                    </div>

                </div>

            </div>


            <div className="admin-settings">

                <div className="admin-settings__header">
                    <DivideCircle />
                    <h4 className="admin-settings__sub-title">
                        Partial Refund Policy
                    </h4>
                </div>

                <div className="admin-settings__input-row" >

                    <div>
                        <label>
                            Days Before Check-In (Less than)
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="7" />
                    </div>

                    <div>
                        <label>
                            Days Before Check-In (Greater than)
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="3" />
                    </div>

                </div>

                <div className="admin-settings__input-row" >

                    <div>
                        <label>
                            Refund Percentage to User
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="50" />
                    </div>

                    <div>
                        <label>
                            Service Provider Compensation (%)
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="42" />
                    </div>

                </div>

            </div>

            <div className="admin-settings">

                <div className="admin-settings__header">
                    <XCircle />
                    <h4 className="admin-settings__sub-title">
                        No Refund Policy
                    </h4>
                </div>

                <div className="admin-settings__input-row" >

                    <div>
                        <label>
                            Days Before Check-In (Less than)
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="3" />
                    </div>

                    <div>
                        <label>
                            Refund Percentage to User
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="0" />
                    </div>

                </div>

                <div className="admin-settings__input-row" >

                    <div>
                        <label>
                            Platform Commission or Processing Fee (%)
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="8" />
                    </div>

                    <div>
                        <label>
                            Service Provider Compensation (%)
                            <span className="input-required">*</span>
                        </label>
                        <input type="num" value="92" />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default RefundPolicySettings;