<template>
  <Head><title>Payment - Settings</title></Head>
  <Dashboard>
    <h2 class="text-2xl font-bold">Payment Integration Settings</h2>
    <Tabs v-model="activeTab" class="w-full mt-2">
      <TabsList class="w-full flex gap-2">
        <TabsTrigger v-for="tab in tabs" :value="tab" class="flex-1">
          {{ tab }}
        </TabsTrigger>
      </TabsList>
      <Card v-if="initLoading">
        <CardContent>
          <div class="py-20 flex justify-center items-center">
            <LoaderIcon :size="30" class="animate-spin" />
          </div>
        </CardContent>
      </Card>
      <template v-else>
        <TabsContent value="Cash on Delivery">
          <Card>
            <CardHeader>
              <CardTitle class="flex justify-between items-center">
                <p>Cash on Delivery</p>
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="status">Cash on Delivery status </Label>
                <Select id="status" v-model="codForm.status">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem :value="true"> Activate </SelectItem>
                      <SelectItem :value="false"> Deactivate </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <ErrorMessage name="status" :error="error" />
              </div>
              <div class="space-y-2">
                <Label for="message">Payment process message note </Label>
                <Textarea id="message" type="text" v-model="codForm.message" />
                <ErrorMessage name="message" :error="error" />
              </div>
              <div class="flex items-center gap-2">
                <Checkbox id="accept" v-model="accept" />
                <Label for="accept" class="cursor-pointer">
                  Make sure you accept all of our
                  <NuxtLink
                    to="/terms"
                    target="_blank"
                    class="underline font-bold"
                    >Terms and Conditions</NuxtLink
                  >.
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <div class="flex justify-end w-full">
                <Button @click="updateCod" :disabled="!accept"
                  ><LoaderIcon v-if="loading" class="mr-2 animate-spin" />
                  Update Payment info</Button
                >
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="bKash">
          <Card>
            <CardHeader>
              <CardTitle class="flex justify-between items-center">
                <p>bKash Payment configuration</p>
              </CardTitle>
              <CardDescription
                >To get online payment please configure bKash merchant account.
                Don't have bKash merchant account?
                <a
                  href="https://www.bkash.com/business/merchant"
                  target="_blank"
                  class="font-bold text-black"
                  >Apply Now.</a
                ></CardDescription
              >
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label for="status">bKash status </Label>
                  <Select id="status" v-model="bkashForm.status">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem :value="true"> Activate </SelectItem>
                        <SelectItem :value="false"> Deactivate </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="status" :error="error" />
                </div>
                <div class="grid lg:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="appKey">bKash merchant app key </Label>
                    <ShowHideInput
                      id="appKey"
                      type="text"
                      v-model="bkashForm.appKey"
                    />
                    <ErrorMessage name="appKey" :error="error" />
                  </div>
                  <div class="space-y-2">
                    <Label for="secretKey">bKash merchant secret key </Label>
                    <ShowHideInput
                      id="secretKey"
                      type="text"
                      v-model="bkashForm.secretKey"
                    />
                    <ErrorMessage name="secretKey" :error="error" />
                  </div>
                  <div class="space-y-2">
                    <Label for="username">bKash merchant username </Label>
                    <ShowHideInput
                      id="username"
                      type="text"
                      v-model="bkashForm.username"
                    />
                    <ErrorMessage name="username" :error="error" />
                  </div>
                  <div class="space-y-2">
                    <Label for="password">bKash merchant password </Label>
                    <ShowHideInput
                      id="password"
                      type="text"
                      v-model="bkashForm.password"
                    />
                    <ErrorMessage name="password" :error="error" />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="message">Payment process message note </Label>
                  <Textarea
                    id="message"
                    type="text"
                    v-model="bkashForm.message"
                  />
                  <ErrorMessage name="message" :error="error" />
                </div>
                <hr />
                <Card class="shadow-none border-0 mt-0">
                  <CardHeader class="pt-0">
                    <CardTitle>Set advance payment</CardTitle>
                    <CardDescription>
                      Select how much amount you want to get advance from
                      customer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      v-model="bkashForm.type"
                      orientation="horizontal"
                    >
                      <div
                        v-for="(type, index) in bkashPaymentTypes"
                        :key="index"
                        class="space-y-2"
                      >
                        <div class="flex items-center space-x-2">
                          <RadioGroupItem
                            :id="`r${index}`"
                            :value="type.value"
                          />
                          <Label :for="`r${index}`" class="cursor-pointer">
                            {{ type.label }}
                          </Label>
                        </div>
                        <SlideUpDown
                          :active="
                            (type.value === 'percentage' ||
                              type.value === 'fixed') &&
                            bkashForm.type === type.value
                          "
                          :duration="200"
                        >
                          <Input
                            id="amount"
                            type="number"
                            v-model="bkashForm.value"
                          />
                          <ErrorMessage name="value" :error="error" />
                        </SlideUpDown>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
              <div class="flex items-center gap-2 mt-4">
                <Checkbox id="accept" v-model="accept" />
                <Label for="accept" class="cursor-pointer">
                  Make sure you accept all of our
                  <NuxtLink
                    to="/terms"
                    target="_blank"
                    class="underline font-bold"
                    >Terms and Conditions</NuxtLink
                  >.
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <div class="flex justify-end w-full">
                <Button @click="updateBkash" :disabled="!accept"
                  ><LoaderIcon v-if="loading" class="mr-2 animate-spin" />
                  Update Payment info</Button
                >
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Bank Transfer">
          <Card>
            <CardHeader>
              <CardTitle>Bank Transfer Payment configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex justify-center items-center py-20">
                We're currently working on it. Stay tuned — launching soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </template>
    </Tabs>
  </Dashboard>
</template>
<script>
import { EyeIcon, LoaderIcon } from "lucide-vue-next";
import SlideUpDown from "vue-slide-up-down";
import { toast } from "vue-sonner";
export default {
  name: "Payment",
  components: {
    SlideUpDown,
    LoaderIcon,
    EyeIcon,
  },
  data() {
    return {
      initLoading: true,
      loading: false,
      accept: false,
      activeTab: "bKash",
      tabs: ["Cash on Delivery", "bKash", "Bank Transfer"],
      codForm: { message: "", status: true },
      item: null,
      bkashForm: {
        appKey: "",
        secretKey: "",
        username: "",
        password: "",
        message: "",
        type: "full",
        value: 0,
        status: true,
      },
      bkashPaymentTypes: [
        { value: "full", label: "Full Payment" },
        { value: "delivery", label: "Delivery charge only" },
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed" },
      ],
      error: {},
    };
  },
  computed: {
    storeID() {
      return useStore().storeID;
    },
  },
  watch: {
    "bkashForm.type"() {
      this.bkashForm.value = 0;
    },
    activeTab() {
      this.error = {};
      this.accept = false;
      this.codForm = { ...this.item.cod };
      this.bkashForm = { ...this.item.bkash };
    },
    storeID() {
      this.fetchPayment();
    },
  },
  mounted() {
    this.fetchPayment();
  },
  methods: {
    async fetchPayment() {
      try {
        this.initLoading = true;
        const { api } = useApi();
        const { item } = await api.get("/dashboard/settings/payment");
        this.item = item;
        this.codForm = item.cod;
        this.bkashForm = item.bkash;
      } catch (error) {
        console.error(error);
      } finally {
        this.initLoading = false;
      }
    },
    async updateCod() {
      try {
        this.loading = true;
        this.error = {};
        const { api } = useApi();
        await api.post("/dashboard/settings/cod", this.codForm);
        this.fetchPayment();
        toast.success("Payment configuration updated successfully");
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
    async updateBkash() {
      try {
        this.loading = true;
        this.error = {};
        const { api } = useApi();
        await api.post("/dashboard/settings/bkash", this.bkashForm);
        this.fetchPayment();
        toast.success("Payment configuration updated successfully");
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
