import { OrderRepository } from "../../infra/repository/OrderRepository";
import Payment from "../../domain/entity/Payment";
import { PaymentRepository } from "../../infra/repository/PaymentRepository";

export class CreatePayment {
  constructor(readonly paymentRepository: PaymentRepository, readonly orderRepository: OrderRepository) {}

  async execute({ order_id, payment_method }: Input): Promise<Output> {
    const orderRestored = await this.orderRepository.getOrderById(order_id);
    if (!orderRestored) {
      throw new Error("Order not found");
    }
  
    const amount = orderRestored.calculateTotalPrice();
    const payment = Payment.create(order_id, payment_method, amount);

    await this.paymentRepository.savePayment(payment);
    const processPayment = await this.paymentRepository.processPayment(payment);
    
    if (processPayment.status === 'approved') {
        payment.approve();
        await this.paymentRepository.updateStatus(payment);
        orderRestored.receive();
        await this.orderRepository.updateStatus(orderRestored);
    } else {
        payment.reject();
        await this.paymentRepository.updateStatus(payment);
    }

    return {
      payment_id: payment.payment_id,
      status: payment.status
    };
  }
}

type Input = {
  order_id: string;
  payment_method: string;
};

type Output = {
  payment_id: string;
  status: string;
};