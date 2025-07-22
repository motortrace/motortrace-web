import React from 'react'
import { Verified, Car, Briefcase } from 'lucide-react'
import Toggle from '../../Toggle/Toggle';
import "./AdminSettings.scss"

interface UserSettingsProps {
    settings: {
        requireEmailVerification: boolean;
        requirePhoneVerification: boolean;
        allowSocialLogin: boolean;
        autoApproveServiceCenters: boolean;
        autoApprovePartsVendors: boolean;
        maxLoginAttempts: number;
        sessionTimeout: number;
        enableTwoFactor: boolean;
        passwordMinLength: number;
        requireStrongPassword: boolean;
    };
    onSettingsChange: (settings: any) => void;
}

const UserManagementSettings: React.FC<UserSettingsProps> = ({ settings, onSettingsChange }) => {
    const handleChange = (field: string, value: any) => {
        onSettingsChange({ ...settings, [field]: value });
    };

    return (
        <div className="admin-settings">

            <div className="admin-settings__header">
                <Verified size={24} />
                <h3 className="admin-settings__title">
                    User Verification Settings
                </h3>
            </div>

            <div className="admin-settings">

                <div className="admin-settings__header">
                    <Car size={20} />
                    <h4 className="admin-settings__sub-title">
                        Car User Registration & Verification
                    </h4>
                </div>

                <div className="admin-settings__input-row" >
                    <div>
                        <Toggle
                            enabled={settings.requireEmailVerification}
                            onChange={(enabled) => handleChange('requireEmailVerification', enabled)}
                            label="Require Email Verification"
                            description="Users must verify their email before accessing the platform"
                        />
                    </div>

                    <div>
                        <Toggle
                            enabled={settings.requirePhoneVerification}
                            onChange={(enabled) => handleChange('requirePhoneVerification', enabled)}
                            label="Require Phone Verification"
                            description="Users must verify their phone number during registration"
                        />
                    </div>

                </div>

            </div>

            <div className="admin-settings">

                <div className="admin-settings__header">
                    <Briefcase size={20} />
                    <h4 className="admin-settings__sub-title">
                        Service Provider Approval
                    </h4>
                </div>

                <div className="admin-settings__input-row" >
                    <div>
                        <Toggle
                            enabled={settings.autoApproveServiceCenters}
                            onChange={(enabled) => handleChange('autoApproveServiceCenters', enabled)}
                            label="Auto-approve Service Centers"
                            description="Automatically approve service center registrations"
                        />

                    </div>

                    <div>
                        <Toggle
                            enabled={settings.autoApprovePartsVendors}
                            onChange={(enabled) => handleChange('autoApprovePartsVendors', enabled)}
                            label="Auto-approve Parts Vendors"
                            description="Automatically approve spare parts vendor registrations"
                        />
                    </div>

                </div>

            </div>

        </div>
    )
}

export default UserManagementSettings
