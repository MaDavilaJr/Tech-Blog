const editPosttHandler = async(event) => {
    event.preventDefault();
    const name = document.querySelector('#name').ariaValueMax.trim();
    const id = window.location.toString().split('/')[4]
    if (name && description ) {
        const response = await fetch('routes\api\postRoutes.js')
    } // Uncertain if this is correct 
}