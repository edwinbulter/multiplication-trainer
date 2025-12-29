package ebulter.multiply

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ebulter.multiply.data.Score
import ebulter.multiply.data.ScoreRepository
import kotlinx.coroutines.launch

class PracticeViewModel(private val repository: ScoreRepository) : ViewModel() {

    private lateinit var table: String
    private var currentQuestionIndexValue = 0
    private val questions = (1..10).shuffled()
    private var startTime = 0L

    private val _question = MutableLiveData<String>()
    val question: LiveData<String> = _question

    private val _currentQuestionIndex = MutableLiveData<Int>()
    val currentQuestionIndex: LiveData<Int> = _currentQuestionIndex

    private val _totalQuestions = MutableLiveData<Int>()
    val totalQuestions: LiveData<Int> = _totalQuestions

    private val _isCorrect = MutableLiveData<Boolean?>()
    val isCorrect: LiveData<Boolean?> = _isCorrect

    private val _isFinished = MutableLiveData<Boolean>()
    val isFinished: LiveData<Boolean> = _isFinished

    fun setTable(table: String) {
        this.table = table
        startTime = System.currentTimeMillis()
        currentQuestionIndexValue = 0
        _totalQuestions.value = questions.size
        nextQuestion()
    }

    fun checkAnswer(answer: String, username: String) {
        val correctAnswer = table.toDouble() * questions[currentQuestionIndexValue]
        if (answer.replace(',', '.').toDoubleOrNull() == correctAnswer) {
            _isCorrect.value = true
            currentQuestionIndexValue++
            _currentQuestionIndex.value = currentQuestionIndexValue
            if (currentQuestionIndexValue >= questions.size) {
                val duration = System.currentTimeMillis() - startTime
                viewModelScope.launch {
                    repository.insert(Score(username = username, table = table, duration = duration, timestamp = System.currentTimeMillis()))
                }
                _isFinished.value = true
            }
        } else {
            _isCorrect.value = false
        }
    }

    fun nextQuestion() {
        if (currentQuestionIndexValue < questions.size) {
            _question.value = "$table × ${questions[currentQuestionIndexValue]} = "
            _currentQuestionIndex.value = currentQuestionIndexValue
            _isCorrect.value = null
        } else {
            _isFinished.value = true
        }
    }

    fun getStartTime(): Long {
        return startTime
    }
}