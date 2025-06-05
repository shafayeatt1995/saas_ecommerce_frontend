<template>
  <section class="bg-gray-100 px-4 lg:px-0 py-10">
    <div class="container mx-auto">
      <div
        class="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-20"
      >
        <div class="w-full lg:max-w-80">
          <!-- <img src="/images/logo.png" alt="logo" class="max-w-40 max-h-6" /> -->
          <p class="text-black/60 mt-6">
            We have clothes that suits your style and which you’re proud to
            wear. From women to men.
          </p>
          <div class="flex mt-5 lg:mt-9 items-center gap-3">
            <a
              href="#"
              target="_blank"
              class="size-7 flex justify-center items-center rounded-full border border-black/60 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              <TwitterIcon :size="15" />
            </a>
            <a
              href="#"
              target="_blank"
              class="size-7 flex justify-center items-center rounded-full border border-black/60 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              <FacebookIcon :size="15" />
            </a>
            <a
              href="#"
              target="_blank"
              class="size-7 flex justify-center items-center rounded-full border border-black/60 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              <InstagramIcon :size="15" />
            </a>
            <a
              href="#"
              target="_blank"
              class="size-7 flex justify-center items-center rounded-full border border-black/60 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              <Github :size="15" />
            </a>
          </div>
        </div>
        <div class="w-full grid lg:grid-cols-4 grid-cols-2 items-center gap-6">
          <div>
            <h3 class="font-semibold uppercase">Company</h3>
            <ul class="mt-3 lg:mt-6 space-y-4">
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Career
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold uppercase">Help</h3>
            <ul class="mt-3 lg:mt-6 space-y-4">
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Customer Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Delivery Details
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold uppercase">FAQ</h3>
            <ul class="mt-3 lg:mt-6 space-y-4">
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Manage Deliveries
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Payments
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold uppercase">Resources</h3>
            <ul class="mt-3 lg:mt-6 space-y-4">
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Free eBooks
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Development Tutorial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  How to - Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-black/60 hover:text-black hover:underline"
                >
                  Youtube Playlist
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="lg:my-10 my-4" />
      <div
        class="flex flex-col lg:flex-row justify-between items-center gap-4 px-0"
      >
        <p class="text-black/60 text-sm lg:text-base">
          Shop.co © {{ new Date().getFullYear() }}. Developed by
          <a
            href="http://github.com/shafayeatt1995"
            class="underline text-black font-bold"
          >
            Shafayet Al-Anik
          </a>
        </p>
        <div class="px-10">
          <!-- <img
            src="/images/payment.png"
            alt="payment"
            class="lg:h-10 w-full lg:w-auto"
          /> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  FacebookIcon,
  Github,
  InstagramIcon,
  MailIcon,
  TwitterIcon,
} from "lucide-vue-next";

export default {
  name: "Footer",
  components: {
    FacebookIcon,
    Github,
    InstagramIcon,
    MailIcon,
    TwitterIcon,
  },
};
</script>
