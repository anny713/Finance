'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Loader2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { submitContactFormAction, type ContactFormInput } from '@/actions/contact';

export default function ContactUsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitContactFormAction(formData);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
          className: "bg-accent text-accent-foreground",
        });
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
      } else {
        toast({
          title: "Error",
          description: result.error || "Could not send message. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Get In Touch</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions? We're here to help. Reach out to us or fill out the form below.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <ContactCard
          icon={<Mail className="h-8 w-8 text-primary" />}
          title="Email"
          content={<a href="mailto:palanjali945@gmail.com" className="text-primary hover:underline">palanjali945@gmail.com</a>}
          description="For general inquiries and support."
        />
        <ContactCard
          icon={<Phone className="h-8 w-8 text-primary" />}
          title="Phone"
          content={<span className="text-foreground">0000000000</span>}
          description="Mon-Fri, 9am - 5pm EST."
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl font-headline text-center">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Question about investment plans" value={formData.subject} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Type your message here." className="min-h-[120px]" value={formData.message} onChange={handleInputChange} required />
                </div>
                <div className="text-center">
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isPending}>
                       {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Message
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>
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
        <Card className="text-center shadow-md hover:shadow-lg transition-shadow p-6">
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
