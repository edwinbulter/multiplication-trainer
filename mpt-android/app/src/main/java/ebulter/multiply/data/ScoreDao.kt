package ebulter.multiply.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ScoreDao {

    @Insert
    suspend fun insert(score: Score)

    @Query("SELECT * FROM scores ORDER BY duration ASC")
    fun getAllScores(): Flow<List<Score>>

    @Query("SELECT * FROM scores WHERE username = :username ORDER BY duration ASC")
    fun getScoresForUser(username: String): Flow<List<Score>>

    @Query("DELETE FROM scores")
    suspend fun clearScores()
}