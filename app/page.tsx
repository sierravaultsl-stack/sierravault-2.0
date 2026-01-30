import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ProblemSection } from "@/components/sections/problem-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  let userName = undefined
  let isLoggedIn = false

  if (token) {
    try {
      await dbConnect()
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
      const user = await User.findById(decoded.id).lean()
      if (user) {
        isLoggedIn = true
        // Use email as name for now, or fetch NIN name if available?
        // Keeping it simple with email or part of email
        userName = user.email.split("@")[0]
      }
    } catch (err) {
      // Token invalid or expired
      isLoggedIn = false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} userName={userName} />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
