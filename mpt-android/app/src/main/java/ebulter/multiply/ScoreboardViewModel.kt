package ebulter.multiply

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import ebulter.multiply.data.Score
import ebulter.multiply.data.ScoreRepository
import kotlinx.coroutines.launch

class ScoreboardViewModel(private val repository: ScoreRepository) : ViewModel() {

    val allScores: LiveData<List<Score>> = repository.allScores.asLiveData()

    fun getScoresForUser(username: String): LiveData<List<Score>> {
        return repository.getScoresForUser(username).asLiveData()
    }

    fun clearScores() {
        viewModelScope.launch {
            repository.clearScores()
        }
    }
}