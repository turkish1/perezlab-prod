<template>
    <div
        id="hero"
        class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-6xl font-bold text-gray-900 leading-tight"><span class="font-light block">GMP-Certified Pharmaceutical Manufacturing for Global Markets</span>Certifications badges (GMP, FDA, EMA, ISO)</h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">Founded in 2008, Perez Lab is a GMP-certified pharmaceutical manufacturer specializing in solid oral dosage forms and sterile injectables for regulated markets.</p>
            <Button label="Click Here to Place an Order " as="router-link" to="/orders" rounded class="!text-xl mt-8 !px-4"></Button>
        </div>

        <div class="flex justify-center md:justify-end">
            <video src="/demo/images/landing/capsuleMachine.mp4" autoplay loop muted playsinline class="w-3/14 md:w-200"></video>
        </div>
    </div>
</template>
