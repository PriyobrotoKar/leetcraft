import { Button } from '@leetcraft/ui/components/button';
import { Input } from '@leetcraft/ui/components/input';
import { Separator } from '@leetcraft/ui/components/separator';
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconBrandX,
} from '@tabler/icons-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@leetcraft/ui/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit((data: z.infer<typeof LoginSchema>) => {
    console.log('Form submitted:', data);
    // Handle login logic here
  });

  return (
    <div className="bg-card inset-shadow-xs inset-shadow-border relative w-full max-w-md space-y-10 overflow-hidden rounded-xl p-6 pt-8">
      <div className="bg-primary absolute left-1/2 top-0 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[90px]"></div>
      <div className="relative z-10 text-center">
        <img
          src="/logo-dark.svg"
          className="mx-auto mb-6"
          alt="Logo Dark"
          width={48}
          height={48}
        />
        <h1 className="mb-2 text-lg">Welcome Back</h1>
        <p className="text-md text-muted-foreground">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-foreground text-md-medium">
            Sign up
          </Link>
        </p>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Login</Button>
          </form>
        </Form>

        <div className="relative">
          <Separator />
          <span className="bg-card text-muted-foreground text-md-medium absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4">
            OR
          </span>
        </div>

        <div className="flex gap-4 [&>*]:flex-1">
          <Button variant={'tertiary'}>
            <IconBrandGithubFilled />
          </Button>
          <Button variant={'tertiary'}>
            <IconBrandGoogleFilled />
          </Button>
          <Button variant={'tertiary'}>
            <IconBrandX />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
