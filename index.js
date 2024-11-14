const { Client, GatewayIntentBits } = require('discord.js');
const db = require('./database'); // Importing database logic

// Create a new Discord client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Bot login
client.login('');

// Command: Add Workout
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const [command, ...args] = message.content.split(' ');

  // Command: Add Workout
  if (command === '!addworkout') {
    let [workoutName, ...workoutArgs] = args;
    const userId = message.author.id;

    // Check for valid inputs
    if (!workoutName || workoutArgs.length === 0) {
      return message.channel.send('Usage: `!addworkout <workout_name> <reps> [weight in kg or distance in km]`');
    }

    // Normalize workout name (to lowercase) to avoid case issues
    workoutName = workoutName.toLowerCase();

    // Handle Pushups and BW (bodyweight exercises)
    if (workoutName === 'pushups' || workoutName === 'bw') {
      const reps = parseInt(workoutArgs[0]);

      if (isNaN(reps) || reps <= 0) {
        return message.channel.send('Please provide a valid number of reps for bodyweight exercises (positive integer).');
      }

      // Check if the workout already exists for today
      db.getWorkoutHistory(userId).then(workouts => {
        const existingWorkout = workouts.find(workout => workout.workout_name === 'pushups' && workout.date === new Date().toLocaleDateString());

        if (existingWorkout) {
          return message.channel.send('You already logged pushups today!');
        }

        // Insert pushups or BW workout (no weight needed for bodyweight)
        db.addWorkout(userId, 'bw', null, reps, null).then(() => {
          db.updatePR(userId, 'bw', null, reps).then(response => {
            message.channel.send(`Bodyweight exercise added with ${reps} reps! ${response}`);
          });
        }).catch(err => message.channel.send('Error saving bodyweight exercise.'));
      }).catch(err => message.channel.send('Error retrieving workout history.'));
    } else {
      // Handle other workouts (with weight in kg or distance in km)
      let weightOrDistance = parseFloat(workoutArgs[1]);
      const reps = parseInt(workoutArgs[0]);

      if (isNaN(weightOrDistance) || isNaN(reps) || reps <= 0) {
        return message.channel.send('Usage: `!addworkout <workout_name> <reps> <weight in kg or distance in km>`');
      }

      // For distance-related exercises (like running or cycling), treat the second argument as distance
      const isDistanceExercise = workoutName === 'running' || workoutName === 'cycling'; 

      if (isDistanceExercise) {
        if (isNaN(weightOrDistance) || weightOrDistance <= 0) {
          return message.channel.send('Please provide a valid distance in kilometers (positive number).');
        }
      } else {
        // If it's not distance-based, assume it's weight-based (in kg)
        if (isNaN(weightOrDistance) || weightOrDistance <= 0) {
          return message.channel.send('Please provide a valid weight in kilograms (positive number).');
        }
      }

      // Check if the workout already exists for today
      db.getWorkoutHistory(userId).then(workouts => {
        const existingWorkout = workouts.find(workout => workout.workout_name === workoutName && workout.date === new Date().toLocaleDateString());

        if (existingWorkout) {
          return message.channel.send(`You already logged ${workoutName} today!`);
        }

        // Insert the workout (either with weight or distance)
        db.addWorkout(userId, workoutName, weightOrDistance, reps, isDistanceExercise ? weightOrDistance : null).then(() => {
          db.updatePR(userId, workoutName, weightOrDistance, reps).then(response => {
            message.channel.send(`Workout added: ${workoutName} with ${reps} reps and ${weightOrDistance} ${isDistanceExercise ? 'km' : 'kg'}! ${response}`);
          });
        }).catch(err => message.channel.send('Error saving workout.'));
      }).catch(err => message.channel.send('Error retrieving workout history.'));
    }
  }
});
