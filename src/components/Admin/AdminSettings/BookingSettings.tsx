import "./AdminSettings.scss"
import { BookCheck } from 'lucide-react'

const BookingSettings = () => {
  return (
    <div className="admin-settings">

             <div className="admin-settings__header">
                <BookCheck size={24} />
                <h3 className="admin-settings__title">
                    Booking Configurations
                </h3>
            </div>

            <div className="admin-settings__input-row" >
                <div>
                    <label>
                        Minimum Advance Booking (Days)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value = "3" />
                </div>

                <div>
                    <label>
                        Maximum Advance Booking (Days)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value = "30" />
                </div>

            </div>

            <div className="admin-settings__input-row" >

                <div>
                    <label>
                        Advance Payment on Booking Acceptance (%)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value = "25" />
                </div>

                <div>
                    <label>
                        Auto-Cancel Unpaid Accepted Bookings After (Hours)
                        <span className="input-required">*</span>
                    </label>
                    <input type="num" value = "24" />
                </div>

            </div>
      
    </div>
  )
}

export default BookingSettings
