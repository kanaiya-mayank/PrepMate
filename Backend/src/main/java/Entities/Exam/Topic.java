package Entities.Exam;

import jakarta.persistence.*;

@Entity
@Table(name = "TOPIC_TABLE")
public class Topic {
    @Id @GeneratedValue(strategy = GenerationType.TABLE)
    @Column(name = "ID_PK")
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "CHAPTER_FK")
    private Chapter chapter;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }
}
