import {LayoutGrid} from 'lucide-react'

const CapacityInformation = () => {
  return (
    <div className="location-info">
            <div className="basic-info__header">
                <LayoutGrid size={24} />
                <h3 className="basic-info__title">
                    Capacity Information
                </h3>
            </div>

            <div className="basic-info__input-row" >
                <div>
                    <label>
                        Number of Service Bays
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" placeholder="Enter the number of vehicle bays available at your service center" />
                </div>

                <div>
                    <label>
                        Team Size
                        <span className="input-required">*</span>
                    </label>
                    <input type="text" placeholder="Enter the total number of technicians available at your service center" />
                </div>

            </div>
      
    </div>
  )
}

export default CapacityInformation
