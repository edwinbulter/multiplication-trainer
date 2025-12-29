package ebulter.multiply.data

import kotlinx.coroutines.flow.Flow

class ScoreRepository(private val scoreDao: ScoreDao) {

    val allScores: Flow<List<Score>> = scoreDao.getAllScores()

    fun getScoresForUser(username: String): Flow<List<Score>> {
        return scoreDao.getScoresForUser(username)
    }

    suspend fun insert(score: Score) {
        scoreDao.insert(score)
    }

    suspend fun clearScores() {
        scoreDao.clearScores()
    }
}