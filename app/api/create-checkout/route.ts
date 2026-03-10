import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount }: { amount: number } = await req.json();

    // amount comes in as dollars, convert to cents
    const cents = Math.round(amount * 100);

    if (!cents || cents < 100) {
      return NextResponse.json(
        { error: "Minimum donation is $1" },
        { status: 400 }
      );
    }

    if (cents > 50000) {
      return NextResponse.json(
        { error: "Maximum donation is $500" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support Lemonade",
              description: "Thank you for supporting young entrepreneurs!",
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.nextUrl.origin}/plan?checkout=complete`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
