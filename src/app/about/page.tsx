
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Target, Eye } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">About Finance Flow</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted partner in simplifying financial decisions. We connect you with the best financial products through a seamless, transparent, and secure platform.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <InfoCard
          icon={<Briefcase className="h-12 w-12 text-primary" />}
          title="Our Company"
          description="Founded with the goal of making financial planning accessible to everyone, Finance Flow leverages technology to provide clear, unbiased information and recommendations."
        />
        <InfoCard
          icon={<Target className="h-12 w-12 text-primary" />}
          title="Our Mission"
          description="To empower individuals to achieve their financial goals by providing a comprehensive and user-friendly platform for investments, insurance, and loans."
        />
        <InfoCard
          icon={<Eye className="h-12 w-12 text-primary" />}
          title="Our Vision"
          description="To be the leading digital marketplace for financial products, known for our integrity, innovation, and unwavering commitment to our users' financial well-being."
        />
      </div>
    </div>
  );
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="items-center">
                 {icon}
                <CardTitle className="mt-4 font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">{description}</p>
            </CardContent>
        </Card>
    );
}
