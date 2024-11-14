# Discord Workout Logger Bot (Bodyweight clergy)

This is a simple Discord bot built using the `discord.js` library to log users' workouts. The bot allows users to log bodyweight exercises, weight-based exercises, and distance-based exercises like running or cycling. It also prevents users from logging the same workout multiple times in a day and tracks their progress.

## Features

- Add bodyweight exercises (e.g., pushups) to the workout log.
- Add weight-based exercises (e.g., bench press, squats).
- Add distance-based exercises (e.g., running, cycling).
- Prevent users from logging the same workout multiple times on the same day.
- Store and update personal records (PRs) for each workout type.

## Requirements

- Node.js v16 or higher
- `discord.js` library
- A database for storing user workout data (refer to the `database.js` file).

## Setup

### 1. Clone the repository

Clone the repository to your local machine.

```bash
git clone https://github.com/yourusername/discord-workout-bot.git
cd discord-workout-bot
```

### 2. Install dependencies

Install the required dependencies using npm.

```bash
npm install
```

### 3. Configure the bot

- Create a `.env` file to store your bot token securely. You should **never expose your bot token publicly**.
- In the `.env` file, add the following:

```env
DISCORD_TOKEN=your-bot-token-here
```

Replace `your-bot-token-here` with your actual Discord bot token.

### 4. Set up the database

This bot assumes you have a `database.js` file for handling the logic of saving and retrieving user workouts. Ensure your database is set up and connected properly for storing workouts and updating personal records.

### 5. Run the bot

Once everything is set up, start the bot using the following command:

```bash
node bot.js
```

### 6. Interacting with the bot

Users can interact with the bot by sending the following command in a text channel where the bot is present:

#### `!addworkout <workout_name> <reps> <weight_in_kg_or_distance_in_km>`

- `workout_name`: Name of the workout (e.g., `pushups`, `running`, `benchpress`).
- `reps`: The number of repetitions performed (integer).
- `weight_in_kg_or_distance_in_km`: Either the weight lifted (in kg) for weight exercises or the distance covered (in km) for distance-based exercises.

#### Example commands:

- `!addworkout pushups 30`
- `!addworkout benchpress 10 60` (10 reps with 60 kg)
- `!addworkout running 5 0` (5 km run)

The bot will:

- Verify if the workout data is valid (positive integers for reps and appropriate values for weight/distance).
- Ensure users do not log the same workout more than once per day.
- Save the workout data to the database.
- Update the user's personal records (PRs) if needed.

### 7. Permissions

Ensure that the bot has the required permissions to read messages and send messages in the channels where it operates.

## Bot Command Details

### `!addworkout`

- Adds a workout to the user's log.
- Supports bodyweight exercises (e.g., pushups), weight-based exercises (e.g., bench press, squats), and distance-based exercises (e.g., running, cycling).
- Example:
  - `!addworkout pushups 30`
  - `!addworkout benchpress 10 60`
  - `!addworkout running 5 0`

### Error handling

- The bot will send a helpful message if the user provides invalid data (e.g., missing reps or invalid workout name).
- If the user tries to log the same workout on the same day, the bot will inform them that it has already been logged.
- The bot will handle database errors and notify the user if anything goes wrong.

## Database Logic

- **`db.getWorkoutHistory(userId)`**: Retrieves the workout history for the specified user.
- **`db.addWorkout(userId, workoutName, weight, reps, distance)`**: Adds the workout data to the user's history.
- **`db.updatePR(userId, workoutName, weight, reps)`**: Updates the user's personal record (PR) for the given workout.

Ensure that the database is correctly implemented and connected to store workout history and personal records.

## License

This project is open-source and distributed under the MIT License.

---

Feel free to contribute or modify the bot for your needs. If you have any questions or issues, open an issue in the GitHub repository!
