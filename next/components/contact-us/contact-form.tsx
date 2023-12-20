import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { StatusMessage } from "@/ui/status-message";
import { Textarea } from "@/ui/textarea";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber: number;
};

export function ContactForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => { 
    const response = await fetch(`/api/contact`, {
      method: "POST",
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        message: data.message,
        subject: data.subject,
        phone_number: data.phoneNumber,
      }),
      // This will record the submission with the right language:
      headers: {
        "accept-language": router.locale,
      },
    });

    if (!response.ok) {
      alert("Error!");    
    }
  };

  const onErrors = (errors) => console.error(errors);

  if (isSubmitSuccessful) {
    return (
      <StatusMessage level="success" className="mx-auto w-full max-w-3xl">
        <p className="mb-4">{t("form-thank-you-message")}</p>
        <Button type="button" onClick={() => reset()}>
          {t("form-send-another-message")}
        </Button>
      </StatusMessage>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onErrors)}
      className="mx-auto mb-4 flex max-w-3xl flex-col gap-5 rounded border border-finnishwinter bg-white p-4 shadow-md transition-all hover:shadow-md"
    >
      
        <>
          <div className="flex justify-between">
          <div className="w-1/2">
            <Label htmlFor="firstName"></Label>
            <input
              className="border w-11/12 p-1"
              type="text"
              id="firstName"
              placeholder="First Name"
              {...register("firstName", {
                required: true,
              })}
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="lastName"></Label>
            <input
              className="border w-11/12 p-1 float-right"
              type="text"
              id="lastName"
              placeholder="Last Name"
              {...register("lastName", {
                required: true,
              })}
            />
          </div>
          </div>
          <div className="flex justify-between">
          <div className="w-1/2">
            <Label htmlFor="email"></Label>
            <input
              className="border w-11/12 p-1"
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", {
                required: true,
              })}
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="phoneNumber"></Label>
            <input
              className="border w-11/12 p-1 float-right"
              type="number"
              id="phoneNumber"
              placeholder="Phone"
              {...register("phoneNumber", {
                required: true,
              })}
            />
          </div>
          </div>
          <div>
            <Label htmlFor="subject"></Label>
            <input
              className="border w-full p-1"
              type="text"
              id="subject"
              placeholder="Subject"
              {...register("subject", {
                required: true,
              })}
            />
          </div>
          <div>
            <Label htmlFor="message"></Label>
            <Textarea
              id="message"
              placeholder="Write Something ..."
              {...register("message", {
                required: true,
              })}
            />
          </div>

          <Button type="submit">{t("form-submit")}</Button>
        </>
    </form>
  );
}