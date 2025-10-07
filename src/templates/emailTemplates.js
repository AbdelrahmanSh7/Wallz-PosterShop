// Email templates for WallZ orders

export const emailTemplates = {
  // New order notification template
  newOrderTemplate: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>🎉 New Order Alert - WallZ</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
            .success { background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; }
            .info { background: #d1ecf1; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .items-list { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .item { padding: 8px 0; border-bottom: 1px solid #dee2e6; }
            .item:last-child { border-bottom: none; }
            .total { font-size: 18px; font-weight: bold; color: #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 NEW ORDER ALERT!</h1>
                <p>WallZ - Your Wall Art Store</p>
            </div>
            
            <div class="content">
                <div class="success">
                    <h2>🚀 Exciting News!</h2>
                    <p>A new order has just been placed on your WallZ store! This could be the start of something amazing! 💫</p>
                </div>

                <div class="order-card">
                    <h3>📋 Order Details</h3>
                    <div class="highlight">
                        <strong>Order ID:</strong> {{order_id}}<br>
                        <strong>Date:</strong> {{order_date}}<br>
                        <strong>Status:</strong> {{order_status}}<br>
                        <strong>Total Amount:</strong> <span class="total">{{total_amount}} EGP</span>
                    </div>
                </div>

                <div class="order-card">
                    <h3>👤 Customer Information</h3>
                    <div class="info">
                        <strong>Name:</strong> {{customer_name}}<br>
                        <strong>Phone 1:</strong> {{customer_phone1}}<br>
                        <strong>Phone 2:</strong> {{customer_phone2}}<br>
                        <strong>Address:</strong> {{customer_address}}<br>
                        <strong>Governorate:</strong> {{customer_governorate}}
                    </div>
                </div>

                <div class="order-card">
                    <h3>🛍️ Order Items ({{items_count}} items)</h3>
                    <div class="items-list">
                        {{items_list}}
                    </div>
                </div>

                <div class="highlight">
                    <h3>⚡ Action Required!</h3>
                    <p>Don't keep your customer waiting! Process this order as soon as possible to maintain excellent customer satisfaction! 🌟</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://your-admin-panel-url.com/admin/orders" class="btn">View Order in Admin Panel</a>
                </div>

                <div class="footer">
                    <p>This email was sent automatically by WallZ Order Management System</p>
                    <p>© 2024 WallZ - Your Wall Art Store</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `,

  // Order status update template
  statusUpdateTemplate: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>📊 Order Status Update - WallZ</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .status-change { background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Order Status Updated!</h1>
                <p>WallZ - Your Wall Art Store</p>
            </div>
            
            <div class="content">
                <div class="status-card">
                    <h3>📋 Order Information</h3>
                    <p><strong>Order ID:</strong> {{order_id}}</p>
                    <p><strong>Customer:</strong> {{customer_name}}</p>
                    <p><strong>Date:</strong> {{order_date}}</p>
                    <p><strong>Total:</strong> {{total_amount}} EGP</p>
                </div>

                <div class="status-change">
                    <h3>🔄 Status Change</h3>
                    <p><strong>Previous Status:</strong> {{old_status}}</p>
                    <p><strong>New Status:</strong> {{new_status}}</p>
                </div>

                <div class="footer">
                    <p>This email was sent automatically by WallZ Order Management System</p>
                    <p>© 2024 WallZ - Your Wall Art Store</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
};

export default emailTemplates;
