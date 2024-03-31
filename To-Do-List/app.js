new Vue({
    el: '#app',
    data: {
        newTodo: '', // Input field for new tasks
        todos: [ // Array to store the inbuild to do list
            { text: 'Learn Vue.js', completed: false }, // to do item 1 default
            { text: 'Build a to-do app', completed: false } // to do item 2 default
        ],
        filter: 'all' // Filter for displaying todos (all, completed, active)
    },
    computed: {
        filteredTodos() { // Computed property to filter todos based on filter type
            if (this.filter === 'completed') 
			{ 									// Filter for completed todos
                return this.todos.filter(todo => todo.completed);
            } 
			else if (this.filter === 'active') 
			{ 									// Filter for active todos
                return this.todos.filter(todo => !todo.completed);
            } 
			else 
			{ 								// Default: display all todos
                return this.todos;
            }
        }
    },
    methods: 
	{
        addTodo() 
		{ 			// Method to add new todo
            if (this.newTodo.trim() !== '') 
			{ 
				// Check if input is not empty
                this.todos.push({ text: this.newTodo, completed: false }); // Add new tasks to todos array
                this.newTodo = ''; // Clear input field
            }
        },
        removeTodo(index) 
		{ // Method to remove todo
            this.todos.splice(index, 1); // Remove todo at specified index
        },
        clearCompleted() 
		{ // Method to clear completed todos
            this.todos = this.todos.filter(todo => !todo.completed); // Filter out completed todos
        },
        editTodo(index) 
		{ // Method to edit todo list 
            this.todos[index].editing = true; // Set editing flag to true for the specified todo
            this.$nextTick(() => { // Wait for next tick to focus on input field
                this.$refs.input[index].focus(); // Focus on input field for editing
            });
        },
        saveTodo(index) 
		{ // Method to save edited todo
        this.todos[index].editing = false; // Set editing flag to false to stop editing mode
        }
    }
});
