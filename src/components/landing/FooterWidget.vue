<template>
    <div class="py-6 px-6 mx-0 mt-20 lg:mx-20">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-2">
                <a class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer">
                    <img src="/demo/images/blueflask.jpg" class="w-4/12" alt="blueflask" style="margin-left: 4px" />
                </a>
            </div>

            <div class="col-span-12 md:col-span-10">
                <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Company</h4>
                        <router-link to="/about" class="block mb-2 hover:text-primary-500">About Us</router-link>
                        <!-- <router-link to="/news" class="block mb-2 hover:text-primary-500">News</router-link> -->
                        <!-- <router-link to="/careers" class="block mb-2 hover:text-primary-500">Careers</router-link> -->
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Resources</h4>
                        <router-link to="/case-studies" class="block mb-2 hover:text-primary-500">Case Studies</router-link>
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Community</h4>
                        <router-link to="/faq" class="block mb-2 hover:text-primary-500">FAQ</router-link>
                    </div>

                    <!-- <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Legal</h4>
                        <router-link to="/privacy" class="block mb-2 hover:text-primary-500">Privacy Policy</router-link>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
