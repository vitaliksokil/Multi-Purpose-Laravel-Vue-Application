<style>
    .widget-user-header {
        background-size: cover;
    }

    .widget-user .widget-user-header {
        height: 250px;

    }
</style>


<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="card card-widget widget-user">
                    <!-- Add the bg color to the header using any of the bg-* classes -->
                    <div class="widget-user-header text-white"
                         style="background: url('./img/bg_profile.jpg') center center;">
                        <h3 class="widget-user-username">{{this.form.name}}</h3>
                        <h5 class="widget-user-desc">{{this.form.type}}</h5>
                        <div class="widget-user-image">
                            <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">3,200</h5>
                                    <span class="description-text">SALES</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">13,000</h5>
                                    <span class="description-text">FOLLOWERS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4">
                                <div class="description-block">
                                    <h5 class="description-header">35</h5>
                                    <span class="description-text">PRODUCTS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->

                        </div>
                        <!-- /.row -->
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link active show" href="#activity" data-toggle="tab">Activity</a>
                            </li>
                            <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Settings</a>
                            </li>
                        </ul>
                    </div><!-- /.card-header -->
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="tab-pane active show" id="activity">
                                activity
                            </div>
                            <!-- /.tab-pane -->

                            <div class="tab-pane" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="inputName" class="col-sm-2 control-label">Name</label>

                                        <div class="col-sm-10">
                                            <input v-model="form.name" name="name" :class="{ 'is-invalid': form.errors.has('name') }" type="text" class="form-control" id="inputName" placeholder="Name">
                                            <has-error :form="form" field="name"></has-error>

                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail" class="col-sm-2 control-label">Email</label>

                                        <div class="col-sm-10">
                                            <input type="email" class="form-control" id="inputEmail"
                                                   placeholder="Email" name="email" v-model="form.email"   :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>

                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <label for="inputExperience" class="col-sm-2 control-label">Experience</label>

                                        <div class="col-sm-10">
                                            <textarea class="form-control" id="inputExperience"
                                                      placeholder="Experience" name="bio" v-model="form.bio"  :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                            <has-error :form="form" field="bio"></has-error>

                                        </div>

                                    </div>

                                    <div class="form-group">
                                        <label for="inputProfilePhoto" class="col-sm-2 control-label">Profile photo</label>

                                        <div class="col-sm-10">
                                            <input type="file" accept="image/*" @change="updateProfile" class="form-control" id="inputProfilePhoto"  style="border:none;padding: 0;">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="inputPassword" class="col-sm-2 col-md-12 control-label">Password(leave empty if not changing)</label>

                                        <div class="col-sm-10">
                                            <input type="password" name="password" v-model="form.password" class="form-control" id="inputPassword" placeholder="Password" :class="{ 'is-invalid': form.errors.has('password') }">
                                            <has-error :form="form" field="password"></has-error>

                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-offset-2 col-sm-10">
                                            <button type="submit" class="btn btn-primary" @click.prevent="updateInfo">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
                <!-- /.nav-tabs-custom -->
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'Profile',
        methods:{
            clearData(e){
                this.tempPhoto = '';
                e.target.value = '';
            },
            getProfilePhoto(){
                let photo = this.form.photo;
                if(this.form.photo){
                    let prefix = (this.form.photo.match(/\//) ? '' : '/img/profile/');
                    return prefix + this.form.photo;
                }else {
                    photo = 'img/profiles/' + this.form.photo;
                }
                return photo;

            },
            photoError(title,description,e){
                this.$Progress.fail();

                swal.fire(
                    title,
                    description,
                    'error'
                );
                this.clearData(e);
            },

            updateInfo(){
                let inputProfilePhoto = document.getElementById('inputProfilePhoto');


                this.$Progress.start();

                if(this.form.password == ''){
                    this.form.password = undefined;
                }
                if(this.tempPhoto !== ''){
                    this.form.photo=this.tempPhoto;
                }

                this.form.put('api/profile')
                    .then(()=>{
                    this.$Progress.finish();
                    swal.fire(
                        'Updated!',
                        'Info was successfully updated.',
                        'success'
                    );

                    Fire.$emit('refreshProfile');
                    inputProfilePhoto.value='';
                }).catch(()=>{
                    this.$Progress.fail();

                    swal.fire(
                        'Error!',
                        'Something\'s gone wrong.',
                        'error'
                    );

                    Fire.$emit('refreshProfile');
                    inputProfilePhoto.value='';

                });
            },
            updateProfile(e){
                this.$Progress.start();
                let file = e.target.files[0];
                let type = file.type;
                if(type.search(/image/) === -1)
                {
                    this.photoError('Error!','File must be an image',e);
                    return -1;
                }

                let reader = new FileReader();
                if(file['size'] < 2111775){
                    reader.onloadend = (file) => {
                        // console.log('RESULT', reader.result)
                        this.tempPhoto = reader.result;
                    };
                    reader.readAsDataURL(file);
                    this.$Progress.finish();
                }else{
                    this.photoError('Error!','File is bigger than 2MB',e);
                    return -1;
                }
            },


            loadProfile(){
                axios.get('api/profile').then(({data})=>{
                    this.form.fill(data);
                });
            },
        },
        data(){
            return{
                form: new Form({
                    id:'',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: '',
                }),
                tempPhoto: '',
            }
        },
        mounted() {

        },
        created(){
            this.loadProfile();
            Fire.$on('refreshProfile', () => {
                this.loadProfile();
                this.tempPhoto = '';
            });
        },
    }
</script>
