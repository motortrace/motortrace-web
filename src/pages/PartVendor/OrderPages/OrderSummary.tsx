import OrderDetails from '../../../components/PartVendorComponents/OrderSummaryPageComponents/PendingOrderDetails/OrderDetails'
import OrderMetricCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderMetricCard/OrderMetricCard'

const OrderSummary = () => {
    return (
        <div>
            <OrderMetricCard/>
            <OrderDetails/>
        </div>
    )
}

export default OrderSummary
