const app = Vue.createApp({
    data() {
        return {
            images: [],
            savedImages: [],
            selectedImageId: null
        }
    },
    created() {
        /*
        * Here we must load some data to make project work
        * Otherwise we must stop it and show proper message to the user
        */

        /*
         * As the first bootstrapping action, we load gallery photos from api
         * So we must wait until receiving data
         * And then load fetched data to images
         */
        this.loadImagesFromTourScanner().then(response => this.images = response.data);

        /* We also need to load saved images id from localstorage before DOM become loaded */
        this.savedImages = localStorage.getItem('savedImages') ?
            JSON.parse(localStorage.getItem('savedImages')) : [];

    },
    computed: {
        /*
        * For interacting with modals, we need to make them here as a computed variable
        * So we can hide or show modals on events
        */

        /*
        * Create saving confirmation and save as computed variable
        */
        savingModal() {
            return new bootstrap.Modal(document.getElementById('savingConfirmationModal'));
        },

        /*
        * Create removing confirmation and save as computed variable
        */
        removingModal() {
            return new bootstrap.Modal(document.getElementById('removingConfirmationModal'));
        }
    },
    methods: {
        /*
        * make background image url attribute
        */
        getImageUrl: function (url) {
            return 'background-image: url(' + url + ')';
        },
        /*
        * Check if given image id is saved before
        */
        isSaved(imageId) {
            return this.savedImages.indexOf(imageId) > -1;
        },

        /*
        * Store selected image id and open saving confirmation modal
        */
        showSavingConfirmationModal(imageId) {
            this.selectedImageId = imageId;
            this.savingModal.show();
        },

        /*
        * Store selected image id and open removing confirmation modal
        */
        showRemovingConfirmationModal(imageId) {
            this.selectedImageId = imageId;
            this.removingModal.show();
        },

        /*
        * Close saving confirmation modal
        */
        hideSavingConfirmationModal() {
            this.savingModal.hide();
        },

        /*
        * Close removing confirmation modal
        */
        hideRemovingConfirmationModal() {
            this.removingModal.hide();
        },

        /*
        * Delete selected image id from savedImages
        * Ready for calling other methods to delete image id from localstorage
        * And close removing confirmation modal
        */
        removingSavedPhoto() {
            this.savedImages.splice(this.savedImages.indexOf(this.selectedImageId), 1);
            this.updateSavedPhotoInLocalStorage();
            this.hideRemovingConfirmationModal();
        },

        /*
        * Replace localstorage savedImages item with current savedImages data
        */
        updateSavedPhotoInLocalStorage() {
            localStorage.setItem('savedImages', JSON.stringify(this.savedImages));
        },

        /*
        * Send selected image id to tourscanner by api calling
        * Then add image id to savedImages variable on success api call
        * Also update localstorage savedImages item
        * Finally close the saving confirmation modal
        */
        saveSelectedPhoto() {
            axios.get('https://tourscanner.com/interview/save_image/' + this.selectedImageId, {
                headers: {"Accept": "application/json"}
            }).then(response => {
                this.savedImages.push(this.selectedImageId);
                this.updateSavedPhotoInLocalStorage();
                this.hideSavingConfirmationModal();
            });
        },

        /*
        * Async api call method for fetching images from tourscanner and booting up the project on it
        * So we must stop anything until fetching data is done
        */
        async loadImagesFromTourScanner() {
            try {
                return await axios.get("https://tourscanner.com/interview/images");
            } catch (error) {
                console.log(error);
            }
        }
    }
}).mount('#gallery');