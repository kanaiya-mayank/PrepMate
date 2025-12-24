package Entities.User;

import Entities.Exam.Exam;
import jakarta.persistence.*;

@Entity
@Table(name = "STUDENT_TABLE")
public class Student {
    @Id
    @Column(name = "USER_NAME_PK")
    private String username;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "EXAM_NAME_FK")
    private Exam exam;


    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
