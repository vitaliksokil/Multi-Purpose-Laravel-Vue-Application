<template>
    <div class="container">
        <div class="row" v-if="$gate.isAdminOrAuthor()">
            <div class="col-md-12">
                <div class="card mt-5">
                    <div class="card-header">
                        <h3 class="card-title">Users table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="newModal">

                                Add New
                                <i class="fa fa-user-plus"></i>

                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                            <tr v-for="user in users.data" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upText}}</td>
                                <td>{{user.created_at | myDate}}</td>
                                <td>
                                    <button class="btn btn-light" @click="editModal(user)">
                                        <i class="fa fa-edit blue"></i>
                                    </button>
                                    <button class="btn btn-light" @click="deleteUser(user.id)">
                                        <i class="fa fa-trash red"></i>
                                    </button>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                    <div class="card-footer">
                        <pagination :data="users" @pagination-change-page="getResults"></pagination>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewLabel">{{editMode ? "Edit user" : "Add new user"}} </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? updateUser() : createUser()">
                        <div class="modal-body">

                            <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" name="name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input v-model="form.email" type="email" name="email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <label>Short bio for user</label>
                                <textarea v-model="form.bio" name="bio"
                                          class="form-control"
                                          :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>

                            <div class="form-group">
                                <label>Select user role</label>
                                <select v-model="form.type" id="type" name="type"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="user">Standart User</option>
                                    <option value="admin">Admin</option>
                                    <option value="author">Author</option>

                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input v-model="form.password" type="password" name="password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="submit" :class="editMode ? 'btn btn-success' : 'btn btn-primary'">{{editMode ?
                                "Update" : "Create"}}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                // Create a new form instance
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: '',
                }),
                users: {}
            }
        },

        methods: {
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },
            updateUser() {
                this.$Progress.start();
                this.form.put('api/user/' + this.form.id).then(() => {
                    this.$Progress.finish();
                    $('#addNew').modal('hide');
                    Fire.$emit('successOperation');
                    swal.fire(
                        'Updated!',
                        'User was successfully updated.',
                        'success'
                    )
                }).catch(() => {
                    this.$Progress.fail();
                    $('#addNew').modal('hide');

                    swal.fire(
                        'Error!',
                        'Something\'s gone wrong.',
                        'error'
                    )
                });

            },
            newModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');

            },
            editModal(user) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },
            createUser() {
                this.$Progress.start();

                this.form.post('api/user')
                    .then(() => {
                        Fire.$emit('successOperation');


                        $('#addNew').modal('hide');
                        Toast.fire({
                            type: 'success',
                            title: 'User created successfully'
                        });

                        this.$Progress.finish();
                    })
                    .catch(() => {
                        this.$Progress.fail();
                        $('#addNew').modal('hide');

                        swal.fire(
                            'Error!',
                            'Something\'s gone wrong.',
                            'error'
                        )
                    });


            },
            loadUsers() {
                if (this.$gate.isAdmin() || this.$gate.isAuthor()) {
                    axios.get('api/user').then(({data}) => (this.users = data));
                }
            },
            deleteUser(id) {
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                    if (result.value) {
                        this.$Progress.start();

                        this.form.delete('api/user/' + id).then(() => {
                            Fire.$emit('successOperation');
                            swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )

                        }).catch(() => {
                            swal("Failed!", "There was something wrong", "warning");
                        });
                        this.$Progress.finish();

                    }
                })
            }
        },
        created() {
            Fire.$on('searching', () => {
                this.$Progress.start();

                let query = this.$parent.search;
                axios.get('api/findUser?q=' + query)
                    .then((data) => {
                        this.$Progress.finish();
                       this.users = data.data;
                    }).catch(() => {

                    this.$Progress.fail();

                    swal.fire(
                        'Error!',
                        'Something\'s gone wrong.',
                        'error'
                    )
                });


            });
            this.loadUsers();
            Fire.$on('successOperation', () => {
                this.loadUsers();
            });
        },
        name: 'Users',

    }
</script>
