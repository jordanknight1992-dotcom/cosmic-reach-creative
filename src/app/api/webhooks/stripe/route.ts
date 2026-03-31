import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRegistrationGrant } from "@/lib/mc-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.toString() ?? null;

    if (email) {
      try {
        await createRegistrationGrant({
          email,
          grant_type: "stripe",
          stripe_session_id: session.id,
          stripe_customer_id: customerId ?? undefined,
        });
        console.log(`Registration grant created for ${email} via Stripe checkout ${session.id}`);
      } catch (err) {
        console.error("Failed to create registration grant:", err);
      }
    } else {
      console.warn("Stripe checkout.session.completed without customer email:", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
