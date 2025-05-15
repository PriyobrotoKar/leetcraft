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
} from '@leetcraft/ui/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import AuthService from '@/api/services/auth';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

const SignupSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(8),
});

function SignupForm() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof SignupSchema>) =>
      AuthService.register({
        ...data,
        name: `${data.firstname} ${data.lastname}`,
      }),
    onSuccess: async (data, variables) => {
      await AuthService.login({
        email: data.email,
        password: variables.password,
      });

      setAuth({
        user: data,
      });

      navigate({
        to: '/',
      });
    },
    onError: (error) => {
      console.error('Signup error:', error);
      toast.error(error.message);
    },
  });

  const onSubmit = form.handleSubmit((data: z.infer<typeof SignupSchema>) => {
    mutate(data);
  });

  return (
    <div className="bg-card inset-shadow-xs inset-shadow-border relative w-full max-w-md space-y-10 overflow-hidden rounded-lg p-6 pt-8">
      <div className="bg-primary absolute left-1/2 top-0 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[90px]"></div>
      <div className="relative z-10 text-center">
        <img
          src="/logo-dark.svg"
          className="mx-auto mb-6"
          alt="Logo Dark"
          width={48}
          height={48}
        />
        <h1 className="mb-2 text-lg">Create Your Account</h1>
        <p className="text-md text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground text-md-medium">
            Sign in
          </Link>
        </p>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex gap-6">
              <FormField
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe@gmail.com" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button isLoading={isPending} className="w-full">
              Sign up
            </Button>
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

export default SignupForm;
