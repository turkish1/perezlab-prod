<template>
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-6">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Our Team</div>
            <!-- <span class="text-muted-color text-2xl">Amet consectetur adipiscing elit...</span> -->
        </div>

        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
            <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Factory Engineer</div>
                    <img src="/demo/images/landing/factory-engineer.jpg" class="w-10/12 mx-auto" alt="free" />
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <!-- <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$0</span> -->
                            <span class="text-surface-600 dark:text-surface-200">Minimize Down Time</span>
                        </div>
                        <!-- <Button label="Get Started" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button> -->
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Latest Equipment</div>
                    <img src="/demo/images/landing/pharmaceutical-equipment.jpg" class="w-10/12 mx-auto" alt="startup" />
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span class="text-surface-600 dark:text-surface-200">Top of the Line Equipment</span>
                        </div>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Expert Staff</div>
                    <img src="/demo/images/landing/factory-workers-repair-equipment.jpg" class="w-10/12 mx-auto" alt="enterprise" />
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span class="text-surface-600 dark:text-surface-200">15 years of experience</span>
                        </div>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                </div>
            </div>
        </div>
    </div>
</template>
