import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { getImageUrl } from "../../Utils/config";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="rounded-xl border border-slate-700 mt-5 pb-4 mb-5" style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
        }}>
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2 border-slate-700">
                  <tr>
                    <th className="p-2 text-slate-300">Image</th>
                    <th className="p-2 text-slate-300">Product</th>
                    <th className="p-2 text-center text-slate-300">Quantity</th>
                    <th className="p-2 text-slate-300">Unit Price</th>
                    <th className="p-2 text-slate-300">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="p-2">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                          }}
                        />
                      </td>

                      <td className="p-2 text-slate-200">
                        <Link to={`/product/${item.product}`} className="hover:text-blue-400 transition-colors">{item.name}</Link>
                      </td>

                      <td className="p-2 text-center text-slate-300">{item.qty}</td>
                      <td className="p-2 text-center text-slate-300">${item.price}</td>
                      <td className="p-2 text-center font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 rounded-xl border border-slate-700 pb-4 mb-4 p-4" style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
        }}>
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Shipping</h2>
          <p className="mb-4 mt-4 text-slate-300">
            <strong className="text-blue-400">Order:</strong> {order._id}
          </p>

          <p className="mb-4 text-slate-300">
            <strong className="text-blue-400">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4 text-slate-300">
            <strong className="text-blue-400">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4 text-slate-300">
            <strong className="text-blue-400">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4 text-slate-300">
            <strong className="text-blue-400">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <div className="rounded-xl border border-slate-700 p-4" style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
        }}>
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Order Summary</h2>
          <div className="flex justify-between mb-2 text-slate-300">
            <span>Items</span>
            <span>$ {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2 text-slate-300">
            <span>Shipping</span>
            <span>$ {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2 text-slate-300">
            <span>Tax</span>
            <span>$ {order.taxPrice}</span>
          </div>
          <div className="flex justify-between mb-2 pt-2 border-t border-slate-700">
            <span className="font-bold text-slate-200">Total</span>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">$ {order.totalPrice}</span>
          </div>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}{" "}
            {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="text-white w-full py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md mt-4"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              }}
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
