
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Contact Us</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We're here to help. Reach out to us through any of the channels below.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <ContactCard
          icon={<Mail className="h-8 w-8 text-primary" />}
          title="Email"
          content={<a href="mailto:support@financeflow.com" className="text-primary hover:underline">support@financeflow.com</a>}
          description="For general inquiries and support."
        />
        <ContactCard
          icon={<Phone className="h-8 w-8 text-primary" />}
          title="Phone"
          content={<span className="text-foreground">+1 (555) 123-4567</span>}
          description="Mon-Fri, 9am - 5pm EST."
        />
        <ContactCard
          icon={<MapPin className="h-8 w-8 text-primary" />}
          title="Office"
          content={<span className="text-foreground">123 Finance St, Moneyville, USA</span>}
          description="Visit us by appointment."
        />
      </div>
    </div>
  );
}

interface ContactCardProps {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
    description: string;
}

function ContactCard({ icon, title, content, description }: ContactCardProps) {
    return (
        <Card className="text-center shadow-lg hover:shadow-xl transition-shadow p-6">
            <CardHeader className="items-center">
                {icon}
                <CardTitle className="mt-4 font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg font-semibold">{content}</div>
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </CardContent>
        </Card>
    );
}
