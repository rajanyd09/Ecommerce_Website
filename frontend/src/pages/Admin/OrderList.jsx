import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { getImageUrl } from "../../Utils/config";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Order Management ({orders?.length || 0})
              </h1>

              <div className="overflow-x-auto rounded-xl border shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  borderColor: 'rgba(71, 85, 105, 0.5)'
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-300 font-semibold">IMAGE</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">ORDER ID</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">USER</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">DATE</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">TOTAL</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">PAID</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">DELIVERED</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <img
                            src={getImageUrl(order.orderItems[0]?.image)}
                            alt={order._id}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                            }}
                          />
                        </td>
                        
                        <td className="p-4">
                          <span className="text-slate-300 text-sm font-mono">
                            {order._id.substring(0, 10)}...
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-200 font-medium">
                            {order.user ? order.user.username : "N/A"}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-400 text-sm">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ${order.totalPrice?.toFixed(2)}
                          </span>
                        </td>

                        <td className="p-4">
                          {order.isPaid ? (
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md"
                              style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                                color: '#fff'
                              }}
                            >
                              Paid
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md"
                              style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                                color: '#fff'
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {order.isDelivered ? (
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md"
                              style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                                color: '#fff'
                              }}
                            >
                              Delivered
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md"
                              style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                                color: '#fff'
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <Link to={`/order/${order._id}`}>
                            <button className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                              style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                              }}
                            >
                              View Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:w-1/4">
              <AdminMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
