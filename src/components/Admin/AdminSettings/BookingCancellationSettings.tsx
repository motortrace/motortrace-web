import { Ban } from 'lucide-react'
import './AdminSettings.scss'
import Toggle from "../../Toggle/Toggle"

interface BookingCancellationSettingsProps {
    settings: {
        enableBooking: boolean;
        requireAdvanceBooking: number;
        maxAdvanceBooking: number;
        allowCancellation: boolean;
        cancellationPenalty: number;
        enableRescheduling: boolean;
        autoConfirmBookings: boolean;
        enableWaitlist: boolean;
        enableEmergencyBooking: boolean;
        emergencyBookingFee: number;
    };
    onSettingsChange: (settings: any) => void;
}

const BookingCancellationSettings: React.FC<BookingCancellationSettingsProps> = ({ settings, onSettingsChange }) => {

    const handleChange = (field: string, value: any) => {
        onSettingsChange({ ...settings, [field]: value });
    };

    return (
        <div className="admin-settings">
            <div className="admin-settings__header">
                <Ban size={24} />
                <h3 className="admin-settings__title">
                    Booking Cancellation Settings
                </h3>
            </div>

            <div className="admin-settings__input-row" >
                <div>
                    <Toggle
                        enabled={settings.allowCancellation}
                        onChange={(enabled) => handleChange('allowCancellation', enabled)}
                        label="Allow Cancellations"
                        description="Allow users to cancel their bookings"
                    />
                </div>

                <div>
                    <Toggle
                        enabled={settings.enableRescheduling}
                        onChange={(enabled) => handleChange('enableRescheduling', enabled)}
                        label="Allow Rescheduling"
                        description="Allow users to reschedule their bookings"
                    />
                </div>

            </div>
        </div>
    )
}

export default BookingCancellationSettings
