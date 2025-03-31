<script lang="ts">

const images = [
    "https://images.pexels.com/photos/2631067/pexels-photo-2631067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
    "https://images.pexels.com/photos/7594250/pexels-photo-7594250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
    "https://images.pexels.com/photos/6664182/pexels-photo-6664182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
];

</script>

<div class="w-svw lg:grid lg:grid-cols-2 h-svh flex align-center justify-center">
    <div class="flex items-center justify-center py-12">
        <slot></slot>
    </div>
    <div class="bg-muted hidden lg:block">
        <img
                src={images[Math.floor(Math.random() * images.length)]}
                alt="placeholder"
                width="1920"
                height="1080"
                class="h-svh w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
    </div>
</div>
