import { Button, Box } from '@mui/material';
import { useState } from 'react';
import GeneralSettings from '../../components/Admin/AdminSettings/GeneralSettings'
import UserManagementSettings from '../../components/Admin/AdminSettings/UserManagementSettings'
import PaymentAndCommissionSettings from '../../components/Admin/AdminSettings/PaymentAndCommissionSettings';
import BookingSettings from '../../components/Admin/AdminSettings/BookingSettings';
import BookingCancellationSettings from '../../components/Admin/AdminSettings/BookingCancellationSettings';
import RefundPolicySettings from '../../components/Admin/AdminSettings/RefundPolicySettings';

const AdminSettings = () => {

    const [userSettings, setUserSettings] = useState({
        requireEmailVerification: true,
        requirePhoneVerification: false,
        allowSocialLogin: true,
        autoApproveServiceCenters: false,
        autoApprovePartsVendors: false,
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        enableTwoFactor: false,
        passwordMinLength: 8,
        requireStrongPassword: true,
    });

    const [bookingSettings, setBookingSettings] = useState({
        enableBooking: true,
        requireAdvanceBooking: 2,
        maxAdvanceBooking: 30,
        allowCancellation: true,
        cancellationPenalty: 10,
        enableRescheduling: false,
        autoConfirmBookings: false,
        enableWaitlist: true,
        enableEmergencyBooking: true,
        emergencyBookingFee: 25
    });

    // Handler to update user settings
    const handleUserSettingsChange = (newSettings: any) => {
        setUserSettings(newSettings);
        // You can also call an API here to save the settings
        console.log('User settings updated:', newSettings);
    };

    return (
        <div>
            <GeneralSettings />

            <UserManagementSettings
                settings={userSettings}
                onSettingsChange={handleUserSettingsChange}
            />

            <BookingSettings />

            <BookingCancellationSettings
                settings={bookingSettings}
                onSettingsChange={handleUserSettingsChange}
            />

            <RefundPolicySettings />

            <PaymentAndCommissionSettings />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', margin: '5px 5px 0px 5px' }}>
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        borderColor: '#fca5a5',
                        color: '#991b1b',
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
                            borderColor: '#f87171'
                        },
                        fontFamily: 'poppins'
                    }}
                >
                    Discard Changes
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        color: '#065f46',
                        borderColor: '#86efac',
                        textTransform: 'none',
                        fontFamily: 'Poppins',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #a7f3d0 0%, #86efac 100%)',
                            borderColor: '#4ade80'
                        },
                    }}
                >
                    Save Changes
                </Button>
            </Box>
        </div>
    )
}

export default AdminSettings
